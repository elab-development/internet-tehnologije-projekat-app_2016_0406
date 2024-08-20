<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Document;
use App\Models\Comment;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    /**
     * Get all users.
     */
    public function getUsers(Request $request)
    {
        $users = User::all();
        return response()->json($users);
    }

    /**
     * Update user role.
     */
    public function updateUserRole(Request $request, User $user)
    {
        $request->validate([
            'role_id' => 'required|integer|exists:roles,id',
        ]);

        $user->role_id = $request->role_id;
        $user->save();

        return response()->json($user);
    }

    /**
     * Get statistics.
     */
    public function getStatistics()
    {
        // 1. Total number of admins, moderators, and users
        $rolesCount = User::select('role_id', DB::raw('count(*) as total'))
                           ->groupBy('role_id')
                           ->pluck('total', 'role_id');

        $totalAdmins = $rolesCount->get(1, 0);  //   Admin
        $totalModerators = $rolesCount->get(3, 0);  //  Moderator
        $totalUsers = $rolesCount->get(2, 0);  // Assuming role_id 3 is for User

        // 2. Total number of documents, tags, and comments
        $totalDocuments = Document::count();
        $totalTags = Tag::count();
        $totalComments = Comment::count();

        // 3. Top 5 tags by the number of documents
        $topTags = DB::table('document_tag')
            ->join('tags', 'document_tag.tag_id', '=', 'tags.id')
            ->select('tags.name', DB::raw('count(document_tag.document_id) as total_documents'))
            ->groupBy('tags.id', 'tags.name')
            ->orderBy('total_documents', 'desc')
            ->limit(5)
            ->get();

        // 4. Number of created documents per month
        $documentsPerMonth = Document::select(DB::raw('DATE_FORMAT(created_at, "%Y-%m") as month'), DB::raw('count(*) as total'))
            ->groupBy(DB::raw('DATE_FORMAT(created_at, "%Y-%m")'))
            ->orderBy('month', 'asc')
            ->get();

        return response()->json([
            'total_admins' => $totalAdmins,
            'total_moderators' => $totalModerators,
            'total_users' => $totalUsers,
            'total_documents' => $totalDocuments,
            'total_tags' => $totalTags,
            'total_comments' => $totalComments,
            'top_tags' => $topTags,
            'documents_per_month' => $documentsPerMonth,
        ]);
    }
}
