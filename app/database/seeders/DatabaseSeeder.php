<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Document;
use App\Models\Comment;
use App\Models\Role;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // Kreiramo role
        $adminRole = Role::create(['name' => 'Admin', 'description' => 'Administrator role']);
        $userRole = Role::create(['name' => 'User', 'description' => 'User role']);
        $moderatorRole = Role::create(['name' => 'Moderator', 'description' => 'Moderator role']);

        // Kreiramo korisnike
        $user1 = User::create([
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => Hash::make('password'),
            'role_id' => $userRole->id
        ]);

        $user2 = User::create([
            'name' => 'Jane Smith',
            'email' => 'jane@example.com',
            'password' => Hash::make('password'),
            'role_id' => $userRole->id
        ]);

        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'role_id' => $adminRole->id
        ]);

        $moderator = User::create([
            'name' => 'Moderator User',
            'email' => 'moderator@example.com',
            'password' => Hash::make('password'),
            'role_id' => $moderatorRole->id
        ]);

        // Kreiramo dokumente
        $document1 = Document::create([
            'title' => 'Sample Document 1',
            'content' => 'This is the content of the first sample document.',
           
            'user_id' => $user1->id,
            'file_path' => 'documents/sample1.pdf',
        ]);

        $document2 = Document::create([
            'title' => 'Sample Document 2',
            'content' => 'This is the content of the second sample document.',
           
            'user_id' => $user2->id,
            'file_path' => 'documents/sample2.pdf',
        ]);

        // Kreiramo komentare
        $comment1 = Comment::create([
            'content' => 'This is a comment on the first document.',
            'user_id' => $user2->id,
            'document_id' => $document1->id,
        ]);

        $comment2 = Comment::create([
            'content' => 'This is a comment on the second document.',
            'user_id' => $user1->id,
            'document_id' => $document2->id,
        ]);

        $comment3 = Comment::create([
            'content' => 'This is another comment on the first document.',
            'user_id' => $admin->id,
            'document_id' => $document1->id,
        ]);
    }
}

