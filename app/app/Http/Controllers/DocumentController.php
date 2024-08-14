<?php

namespace App\Http\Controllers;

use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use App\Http\Resources\DocumentResource;

class DocumentController extends Controller
{
    /**
     * Display a listing of the documents.
     */
    public function index()
    {
        $documents = Document::all();
        return DocumentResource::collection($documents);
    }

    /**
     * Store a newly created document in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'file' => 'required|file|mimes:pdf,doc,docx,txt|max:2048', // Ograničenje tipova i veličine fajla
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // Čuvanje fajla u storage-u
        $filePath = $request->file('file')->store('documents', 'public');

        $document = Document::create([
            'title' => $request->title,
            'content' => $request->content,
            'user_id' => Auth::id(), // Korisimo ID ulogovanog korisnika
            'file_path' => $filePath,
        ]);

        return new DocumentResource($document);
    }

    /**
     * Display the specified document.
     */
    public function show($id)
    {
        $document = Document::findOrFail($id);
        return new DocumentResource($document);
    }

    /**
     * Update the specified document in storage.
     */
    public function update(Request $request, $id)
    {
        $document = Document::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'file' => 'nullable|file|mimes:pdf,doc,docx,txt|max:2048', // Ograničenje tipova i veličine fajla
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // Ako postoji novi fajl, brišemo stari i čuvamo novi
        if ($request->hasFile('file')) {
            Storage::disk('public')->delete($document->file_path);
            $filePath = $request->file('file')->store('documents', 'public');
            $document->file_path = $filePath;
        }

        $document->update([
            'title' => $request->title,
            'content' => $request->content,
        ]);

        return new DocumentResource($document);
    }

    /**
     * Remove the specified document from storage.
     */
    public function destroy($id)
    {
        $document = Document::findOrFail($id);

        // Brišemo fajl iz storage-a
        Storage::disk('public')->delete($document->file_path);
        
        $document->delete();

        return response()->json(['message' => 'Document deleted successfully.']);
    }
}
