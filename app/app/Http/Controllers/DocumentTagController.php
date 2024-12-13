<?php

namespace App\Http\Controllers;

use App\Models\DocumentTag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Http\Resources\DocumentTagResource;

class DocumentTagController extends Controller
{
    /**
     * Display a listing of the document tags.
     */
    public function index()
    {
        $documentTags = DocumentTag::all();
        return DocumentTagResource::collection($documentTags);
    }

    /**
     * Store a newly created document tag in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'document_id' => 'required|exists:documents,id',
            'tag_id' => 'required|exists:tags,id',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $documentTag = DocumentTag::create([
            'document_id' => $request->document_id,
            'tag_id' => $request->tag_id,
        ]);

        return new DocumentTagResource($documentTag);
    }

    /**
     * Display the specified document tag.
     */
    public function show($id)
    {
        $documentTag = DocumentTag::findOrFail($id);
        return new DocumentTagResource($documentTag);
    }

    /**
     * Update the specified document tag in storage.
     */
    public function update(Request $request, $id)
    {
        $documentTag = DocumentTag::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'document_id' => 'required|exists:documents,id',
            'tag_id' => 'required|exists:tags,id',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $documentTag->update([
            'document_id' => $request->document_id,
            'tag_id' => $request->tag_id,
        ]);

        return new DocumentTagResource($documentTag);
    }

    /**
     * Remove the specified document tag from storage.
     */
    public function destroy($id)
    {
        $documentTag = DocumentTag::findOrFail($id);
        $documentTag->delete();

        return response()->json(['message' => 'Document Tag deleted successfully.']);
    }
}
