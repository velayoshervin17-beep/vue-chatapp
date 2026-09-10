<script setup>

import chatMessage from './ChatMessage.vue';
import ChatInput from './ChatInput.vue';

import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue';
import api from '../services/api';

import { useLobbyStore } from '../stores/lobby';
import { storeToRefs } from 'pinia'

import { formatToMinutes } from '../utils/dateFilters';

import { useTyping } from "@/composables/useTyping";


const store = useLobbyStore()
const { lobbyCode, currentParticipant, participants } = storeToRefs(store);


const sender = computed(() => currentParticipant.value?.sender);

const chatContainer = ref(null);
const messages = ref([]);




const { typingUsers, sendTyping } = useTyping(lobbyCode);


const activeTypersCount = computed(() => {
    // Accessing .value inside a computed property registers it in Vue's dependency tracker
    return typingUsers.value ? typingUsers.value.size : 0;
});


const scrollToBottom = async () => {
    // Wait for Vue to inject the new message HTML elements into the DOM
    await nextTick();

    if (chatContainer.value) {
        chatContainer.value.scrollTo({
            top: chatContainer.value.scrollHeight,
            behavior: 'smooth' // ⚡ Smooth sliding animation
        });
    }
};

watch(
    () => messages.value,
    () => {
        scrollToBottom();
    },
    { deep: true } // ⚡ Required to detect new items pushed inside the array
);

const messagesLoading = ref(false);

const fetchMessages = async () => {

    messagesLoading.value = true;

    try {
        const response = await api.get(`api/chat-messages/${lobbyCode.value}`);
        messages.value = response.data;
    } catch (error) {
        console.error('Error fetching messages:', error);
    } finally {
        messagesLoading.value = false;
    }

};

onMounted(() => {
    fetchMessages()

    console.log('Listening to Pusher(SytemEvent)...');

    // Check if window.Echo exists
    if (window.Echo) {

        console.log("window echo is nut null")

        //         "id": 1,
        // "code": "ABC123",
        // "message": "Hello, this is the first message!",
        // "sender": "User1",
        // "message_type": null,
        // "created_at": "2026-09-07T05:31:22.000000Z",
        // "updated_at": "2026-09-07T05:31:22.000000Z"

        window.Echo.channel(`lobby.${lobbyCode.value}`)
            .listen('.lobby.activity', (data) => {

                console.log("data sender", data.sender, " = ", "current participant sender: ", currentParticipant.value.sender)
                console.log("event:", data.messageType, "= event")

                if (data.sender === currentParticipant.value.sender && data.messageType === "event")
                    return;

                console.log('Pusher data received:', data);
                messages.value.push({
                    id: data.timestamp + data.sender,
                    message: data.message,
                    sender: data.sender,
                    created_at: data.timestamp,
                    messageType: data.messageType
                });
            });
    } else {
        console.error('Laravel Echo is not initialized!');
    }
})

onUnmounted(() => {
    if (window.Echo) {
        window.Echo.leave(`lobby.${lobbyCode.value}`);
    }
});


</script>

<template>
    <div class="chatroom-wrapper">
        <div class="chatroom">lobby - {{ lobbyCode }}</div>
        <div v-if="messagesLoading" class="chat-loading-overlay">
            <div class="loading-spinner"></div>
        </div>
        <div v-else-if="messages.length === 0" class="chat-empty">
            <div class="chat-empty-content">
                <p>No messages yet</p>
                <span>Start the conversation!</span>
            </div>
        </div>
        <div class="chatbox" v-else ref="chatContainer">
            <template v-for="msg in messages" :key="msg.created_at || msg.timestamp">
                <template v-if="msg.message_type === 'chat' || msg.messageType === 'chat'">
                    <chat-message :sender="msg.sender" :message="msg.message"
                        :timestamp="formatToMinutes(msg.created_at || msg.timestamp)"
                        :isOwnMessage="msg.sender === sender" />
                </template>
                <template v-else-if="msg.message_type === 'event' || msg.messageType === 'event'">
                    <div class="system-event-message">
                        <span>{{ msg.message }}</span> <span>{{ formatToMinutes(msg.created_at) }}</span>
                    </div>
                </template>
            </template>
            <div class="typing-area-status">
                <!-- This tracks perfectly anywhere in your template -->
                <div v-if="activeTypersCount > 0" class="typing-indicator">
                    <span>Someone is typing</span>
                    <span class="dots">...</span>
                </div>
            </div>
        </div>
        <div>
            <chat-input :code="lobbyCode" :sender="sender" />
        </div>
    </div>

</template>

<style scoped>
.chatroom-wrapper {

    padding: 16px;
    border: 1px solid gray;
    border-radius: 8px;
    box-sizing: border-box;

    /* added for overlay */
    position: relative;
    height: 100%;

}

.chatroom {
    background: none;
    background-image: linear-gradient(255.255.255.25);
    margin-top: 20px 0px 10px;
    font-weight: 500;
}

.chatbox {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 16px;
    height: 400px;
    overflow-y: auto;
    width: 400px;
    border: 1px solid gray;
    background: #f5e8e3;
    border: 1px solid #eadfdd;
    border-radius: 8px;
    box-shadow: 0 4px 18px rgba(80, 50, 55, 0.08);

    overflow-x: hidden;


}


.chat-loading-overlay {
    position: absolute;
    inset: 0;
    z-index: 10;

    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.75);
}

.chat-empty {
    height: 100%;

    display: flex;
    align-items: center;
    justify-content: center;

    text-align: center;
}

.chat-empty-content p {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 600;
}

.chat-empty-content span {
    display: block;
    margin-top: 0.25rem;
    color: #888;
}


.loading-spinner {
    width: 32px;
    height: 32px;

    border: 3px solid #ddd;
    border-top-color: #333;
    border-radius: 50%;

    animation: spin 0.7s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.system-event-message {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-wrap: wrap;
    gap: 4px 12px;
    /* Minimal spacing and centering */
    margin: 12px auto;
    padding: 6px 12px;
    max-width: 90%;


    background-color: rgba(243, 244, 246, 0.6);
    box-sizing: border-box;

}

/* The actual text ("indo has joined the lobby") */
.system-event-message span:first-child {
    color: #4b5563;
    /* Dark gray text */
    font-size: 0.85rem;
    font-weight: 500;
    font-style: italic;

    flex: 1 1 200px;

    overflow-wrap: break-word;
    word-break: break-word;
}

/* The timestamp */
.system-event-message span:last-child {
    color: #9ca3af;
    /* Muted light gray */
    font-size: 0.75rem;
    font-variant-numeric: tabular-nums;
    /* Prevents text shifting */
    white-space: nowrap;
    margin-left: auto;
    flex-shrink: 0;
}

.typing-indicator {
    color: #f10707;
    font-size: 14px;
}

.dots {
    animation: blink 1.2s infinite;
}

.typing-area-status {
    height: 20px;
    margin-top: 4px;
    margin-bottom: 4px;
    padding-left: 8px;
}

.typing-indicator {
    color: #f10707;
    font-size: 14px;
    font-style: italic;
}

@keyframes blink {

    0%,
    20% {
        opacity: 0;
    }

    50% {
        opacity: 1;
    }

    100% {
        opacity: 0;
    }
}
</style>