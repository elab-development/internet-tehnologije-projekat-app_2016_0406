<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Http\Resources\CommentResource;

class CommentController extends Controller
{
    /**
     * Display a listing of the comments.
     */
    public function index($id)
    {
        $comments = Comment::where('document_id', $id)->get(); 
        return CommentResource::collection($comments);
    }

    /**
     * Store a newly created comment in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'content' => 'required|string',
            'document_id' => 'required|exists:documents,id',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $comment = Comment::create([
            'content' => $request->content,
            'user_id' => Auth::id(),
            'document_id' => $request->document_id,
        ]);

        return new CommentResource($comment);
    }

    /**
     * Display the specified comment.
     */
    public function show($id)
    {
        $comment = Comment::findOrFail($id);
        return new CommentResource($comment);
    }

    /**
     * Update the specified comment in storage.
     */
    public function update(Request $request, $id)
    {
        $comment = Comment::findOrFail($id);

        // Check if the logged-in user is the owner of the comment
        if ($comment->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'content' => 'required|string',
            'document_id' => 'required|exists:documents,id',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $comment->update([
            'content' => $request->content,
            'document_id' => $request->document_id,
        ]);

        return new CommentResource($comment);
    }

    /**
     * Remove the specified comment from storage.
     */
    public function destroy($id)
    {
        $comment = Comment::findOrFail($id);
    
        // Check if the logged-in user is the owner of the comment
        if ($comment->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }
    
        $comment->delete();
    
        return response()->json(['message' => 'Comment deleted successfully.']);
    }
}
