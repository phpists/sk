<?php


namespace Modules\Chat\Services;


class ChatService
{
    public function formatChat($chat)
    {
        $receiver = $this->getChatReceiver($chat);

        return [
            'id' => $chat->id,
            'client_id' => $chat->client_id,
            'employee_id' => $chat->employee_id,
            'unread_messages_count' => $chat->messages_count,
            'last_message_date' => $chat->last_message_date,
            'receiver' => [
                'id' => $receiver->id,
                'name' => $receiver->name,
            ]
        ];
    }

    public function formatChatRoom($chat)
    {
        $receiver = $this->getChatReceiver($chat);

        return [
            'client_id' => $chat->client_id,
            'employee_id' => $chat->employee_id,
            'messages' => $chat->messages,
            'receiver' => [
                'id' => $receiver->id,
                'name' => $receiver->name,
            ],
            'id' => $chat->id,
        ];
    }

    public function getChatReceiver($chat)
    {
        if (!auth()->user()->is_client_chat_member) {
            return $chat->client;
        }

        return $chat->employee;
    }
}
