<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class AiUsageController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $user = $request->user();
        $limit = (int) config('services.ai.daily_limit', 20);
        $cacheKey = 'ai-usage:'.$user->id.':'.now()->toDateString();
        $used = (int) Cache::get($cacheKey, 0);

        return response()->json([
            'used' => $used,
            'remaining' => max(0, $limit - $used),
            'limit' => $limit,
        ]);
    }
}
