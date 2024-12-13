<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class DocumentTagResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'document' => new DocumentResource($this->document),
            'tag' => new TagResource($this->tag),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
