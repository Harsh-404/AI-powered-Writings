<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'content',
        'updated_content',
        'source_url',
        'type',
        'references',
        'isUpdated'
    ];

    protected $casts = [
        'references' => 'array',
        'isUpdated' => 'boolean'
    ];
}
