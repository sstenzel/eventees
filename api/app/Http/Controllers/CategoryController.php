<?php

namespace App\Http\Controllers;

use Laravel\Lumen\Routing\Controller;
use App\Category;

class CategoryController extends Controller
{
    public function index()
    {
        return response()->json(Category::all(), 200);
    }

    public function get($id)
    {
        return Category::findOrFail($id);
    }

}
