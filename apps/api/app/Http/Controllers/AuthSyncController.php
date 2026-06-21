<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuthSyncController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        if ($request->header('X-Api-Secret') !== config('services.thaidevdocs.sync_secret')) {
            return response()->json(['error' => 'unauthorized'], 401);
        }

        $validated = $request->validate([
            'githubId' => ['required', 'string'],
            'login' => ['required', 'string'],
            'name' => ['nullable', 'string'],
            'email' => ['nullable', 'email'],
            'avatar' => ['nullable', 'url'],
        ]);

        $user = User::updateOrCreate(
            ['github_id' => $validated['githubId']],
            [
                'github_login' => $validated['login'],
                'name' => $validated['name'] ?? $validated['login'],
                'email' => $validated['email'] ?? "{$validated['login']}@users.noreply.github.com",
                'avatar_url' => $validated['avatar'],
            ]
        );

        $user->tokens()->delete();
        $token = $user->createToken('nextjs')->plainTextToken;

        return response()->json([
            'token' => $token,
            'is_pro' => (bool) $user->is_pro,
        ]);
    }
}
