<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Article;
use Illuminate\Http\Request;

class ArticleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Article::latest()->get();

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string',
            'content' => 'required',
            'updated_content' => 'nullable',
            'source_url' => 'nullable|url',
            'type' => 'in:original,updated',
            'references' => 'nullable|array'
        ]);

        return Article::create($data);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $article = Article::findOrFail($id);
        return $article;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $article = Article::findOrFail($id);
        
        $data = $request->validate([
            'title' => 'sometimes|string',
            'content' => 'sometimes',
            'updated_content' => 'nullable',
            'source_url' => 'sometimes|nullable|url',
            'type' => 'sometimes|in:original,updated',
            'references' => 'sometimes|nullable|array'
        ]);
        
        $article->update($data);
        return $article;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $article = Article::findOrFail($id);
        $article->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
