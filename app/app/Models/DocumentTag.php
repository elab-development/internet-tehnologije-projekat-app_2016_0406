<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DocumentTag extends Model
{
    use HasFactory;

    protected $fillable = [
        'document_id',
        'tag_id',
    ];

    public function document()
    {
        return $this->belongsTo(Document::class);
    }

    public function tag()
    {
        return $this->belongsTo(Tag::class);
    }
}
