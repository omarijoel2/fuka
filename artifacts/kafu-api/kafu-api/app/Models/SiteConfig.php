<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SiteConfig extends Model
{
    protected $table = 'site_config';

    protected $fillable = ['group', 'key', 'value', 'label', 'type'];

    public static function get(string $group, string $key, mixed $default = null): mixed
    {
        $row = static::where('group', $group)->where('key', $key)->first();
        if (!$row) return $default;
        $val = $row->value;
        if ($row->type === 'json' && is_string($val)) {
            return json_decode($val, true) ?? $default;
        }
        if ($row->type === 'boolean') {
            return filter_var($val, FILTER_VALIDATE_BOOLEAN);
        }
        return $val;
    }

    public static function set(string $group, string $key, mixed $value, string $type = 'text', ?string $label = null): void
    {
        if (is_array($value) || is_object($value)) {
            $value = json_encode($value);
            $type = 'json';
        }
        static::updateOrCreate(
            ['group' => $group, 'key' => $key],
            ['value' => $value, 'type' => $type, 'label' => $label]
        );
    }

    public static function getGroup(string $group): array
    {
        return static::where('group', $group)->get()->mapWithKeys(function ($row) {
            $val = $row->value;
            if ($row->type === 'json' && is_string($val)) {
                $val = json_decode($val, true);
            } elseif ($row->type === 'boolean') {
                $val = filter_var($val, FILTER_VALIDATE_BOOLEAN);
            }
            return [$row->key => $val];
        })->toArray();
    }

    public static function setGroup(string $group, array $data): void
    {
        foreach ($data as $key => $value) {
            static::set($group, $key, $value);
        }
    }
}
