<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('roles', function (Blueprint $table) {
            $table->string('name')->unique()->change(); // Dodaje jedinstveno ograničenje na 'name'
            $table->text('description')->nullable()->change(); // Čini 'description' polje opcionalnim
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('roles', function (Blueprint $table) {
            $table->dropUnique(['name']); // Uklanja jedinstveno ograničenje na 'name'
            $table->text('description')->nullable(false)->change(); // Vraća 'description' polje u obavezno stanje
        });
    }
};
