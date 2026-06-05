<?php

namespace App\Http\Controllers;

use App\Models\Notice;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class NoticesController extends Controller
{
    public function index(Request $request)
    {
        $limit = $request->integer('limit', 10);
        $notices = Notice::where('is_active', true)
            ->orderByDesc('issued_date')
            ->limit($limit)
            ->get()
            ->map(fn($n) => $this->format($n));

        return response()->json($notices);
    }

    public function adminIndex()
    {
        return response()->json(
            Notice::orderByDesc('issued_date')->get()->map(fn($n) => $this->format($n))
        );
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title'           => 'required|string|max:255',
            'description'     => 'nullable|string',
            'category'        => 'required|in:memo,circular,notice,policy,announcement',
            'file_url'        => 'nullable|string',
            'file_name'       => 'nullable|string',
            'file_size'       => 'nullable|string',
            'cover_image_url' => 'nullable|string',
            'issued_date'     => 'required|date',
            'is_active'       => 'boolean',
        ]);

        $notice = Notice::create($data);

        return response()->json($this->format($notice), 201);
    }

    public function show(int $id)
    {
        return response()->json($this->format(Notice::findOrFail($id)));
    }

    public function update(Request $request, int $id)
    {
        $notice = Notice::findOrFail($id);

        $data = $request->validate([
            'title'           => 'sometimes|required|string|max:255',
            'description'     => 'nullable|string',
            'category'        => 'sometimes|required|in:memo,circular,notice,policy,announcement',
            'file_url'        => 'nullable|string',
            'file_name'       => 'nullable|string',
            'file_size'       => 'nullable|string',
            'cover_image_url' => 'nullable|string',
            'issued_date'     => 'sometimes|required|date',
            'is_active'       => 'boolean',
        ]);

        $notice->update($data);

        return response()->json($this->format($notice));
    }

    public function destroy(int $id)
    {
        Notice::findOrFail($id)->delete();

        return response()->json(['message' => 'Notice deleted.']);
    }

    /** Upload a document (PDF / DOC / XLS) attached to a notice */
    public function upload(Request $request)
    {
        $request->validate(['file' => 'required|file|mimes:pdf,doc,docx,xls,xlsx|max:20480']);

        $file = $request->file('file');
        $path = $file->store('notices', 'public');

        $sizeBytes = $file->getSize();
        $sizeHuman = $sizeBytes >= 1048576
            ? round($sizeBytes / 1048576, 1) . ' MB'
            : round($sizeBytes / 1024) . ' KB';

        return response()->json([
            'url'  => Storage::url($path),
            'name' => $file->getClientOriginalName(),
            'size' => $sizeHuman,
        ]);
    }

    /** Upload a cover image (JPEG / PNG / WebP / GIF) for a notice */
    public function uploadImage(Request $request)
    {
        $request->validate(['image' => 'required|file|mimes:jpg,jpeg,png,webp,gif|max:5120']);

        $file = $request->file('image');
        $path = $file->store('notice-images', 'public');

        return response()->json([
            'url' => Storage::url($path),
        ]);
    }

    private function format(Notice $n): array
    {
        return [
            'id'              => $n->id,
            'title'           => $n->title,
            'description'     => $n->description,
            'category'        => $n->category,
            'file_url'        => $n->file_url,
            'file_name'       => $n->file_name,
            'file_size'       => $n->file_size,
            'cover_image_url' => $n->cover_image_url,
            'issued_date'     => $n->issued_date?->toDateString(),
            'is_active'       => $n->is_active,
            'created_at'      => $n->created_at?->toDateString(),
        ];
    }
}
