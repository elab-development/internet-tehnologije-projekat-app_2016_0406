<?php

namespace App\Http\Controllers;

use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use App\Http\Resources\DocumentResource;
use App\Models\Comment;
use App\Models\DocumentTag;
use App\Models\Tag;
use Illuminate\Support\Facades\DB;

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
   /**
     * Store a newly created document in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'file' => 'required|file|mimes:pdf,doc,docx,txt|max:2048', // Ograničenje tipova i veličine fajla
            'tags' => 'array', // Očekujemo niz stringova za tagove
            'tags.*' => 'string|max:255' // Svaki tag treba da bude string maksimalne dužine 255 karaktera
        ]);
    
        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }
    
        $document = null;
    
        DB::transaction(function () use ($request, &$document) {
            // Čuvanje fajla u storage-u
            $filePath = $request->file('file')->store('documents', 'public');
    
            // Kreiranje dokumenta
            $document = Document::create([
                'title' => $request->title,
                'content' => $request->content,
                'user_id' => Auth::id(), // Korisimo ID ulogovanog korisnika
                'file_path' => $filePath,
            ]);
    
            // Obrada tagova
            $tags = $request->input('tags', []);
            foreach ($tags as $tagName) {
                $tag = Tag::firstOrCreate(['name' => $tagName]);
    
                // Povezivanje tagova sa dokumentom
                DB::table('document_tag')->insert([
                    'document_id' => $document->id,
                    'tag_id' => $tag->id,
                ]);
            }
        });
    
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

        // Provera da li je korisnik vlasnik dokumenta
        if ($document->user_id !== Auth::id()) {
            return response()->json(['message' => 'You are not authorized to delete this document.'], 403);
        }

        DB::transaction(function () use ($document) {
            // Brišemo komentare vezane za dokument
            Comment::where('document_id', $document->id)->delete();
            // Brišemo komentare tagove za dokument
            DocumentTag::where('document_id', $document->id)->delete();


            // Brišemo fajl iz storage-a
            Storage::disk('public')->delete($document->file_path);

            // Brišemo dokument
            $document->delete();
        });

        return response()->json(['message' => 'Document and associated comments and tags deleted successfully.']);
    }
    public function download(Request $request)
    {
        $filePath = $request->query('file_path');

        // Proveravamo da li fajl postoji
        if (!Storage::disk('public')->exists($filePath)) {
            return response()->json(['message' => 'File not found.'], 404);
        }

        // Vraćamo fajl korisniku
        return Storage::disk('public')->download($filePath);
    }
     /**
     * Search documents based on various criteria.
     */
    public function search(Request $request)
    {
        $query = Document::query();

        if ($request->has('title')) {
            $query->where('title', 'like', '%' . $request->input('title') . '%');
        }

        if ($request->has('content')) {
            $query->where('content', 'like', '%' . $request->input('content') . '%');
        }

        if ($request->has('tag')) {
            $query->whereHas('tags', function($q) use ($request) {
                $q->where('name', 'like', '%' . $request->input('tag') . '%');
            });
        }

        if ($request->has('user_id')) {
            $query->where('user_id', $request->input('user_id'));
        }

        $documents = $query->get();

        return DocumentResource::collection($documents);
    }
}
