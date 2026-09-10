<script setup>
import api from '../services/api';
import { ref, computed } from 'vue';
import { useTyping } from "@/composables/useTyping";
import { useLobbyStore } from '../stores/lobby';
import { storeToRefs } from 'pinia'

const props = defineProps({
    code: {
        type: String,
        required: true
    },
    sender: {
        type: String,
        required: true
    }
});

const store = useLobbyStore()

const { lobbyCode, currentParticipant, participants } = storeToRefs(store);

const MAX_LIMIT = 255

const message = ref('');
const dbLength = computed(() => message.value.length);


function sendMessage() {

    api.post(`/api/chat-messages/${props.code}`, {
        message: message.value,
        sender: props.sender
    }).then(response => {
        console.log('Message sent:', response.data);
        message.value = ''; // Clear the input field after sending
    }).catch(error => {
        console.error('Error sending message:', error);
    });
}

const { sendTyping } = useTyping(lobbyCode);

let lastTyping = 0;

function handleInput() {
    const now = Date.now();

    if (now - lastTyping < 1500) {
        return;
    }

    lastTyping = now;

    sendTyping();
}

</script>

<template>

    <div class="chat-input">
        <div class="input-wrapper">
            <div class="text-indicator">
                <span class="current-count">{{ dbLength }}/{{ MAX_LIMIT }} space used </span>
            </div>
            <textarea type="text" v-model="message" @input="handleInput" :maxlength="MAX_LIMIT"
                placeholder="Type your message..." />
        </div>
        <button class="send-button" @click="sendMessage">Send</button>
    </div>
</template>

<style scoped>
.chat-input {

    background: #f8f3f1;
    background: #f5e8e3;
    ;
    border: 1px solid #dfd2d0;
    border-radius: 12px;
    margin-top: 10px;

    color: #3f3537;
    padding: 11px 14px;

    outline: none;
    transition:
        border-color 0.2s,
        box-shadow 0.2s;

    display: flex;

}

.input-wrapper {
    flex-grow: 1;
    /* Forces the input wrapper to take up all available space */
    margin-right: 10px;
}

textarea {
    width: 100%;
    display: block;
    /* Restored display so it is visible */
    border: 1px solid #E5E7EB;
    border-radius: 8px;
    outline: none;
    resize: none;
    background: #ffffff;
    ;
    font-family: inherit;
    font-size: 16px;
    line-height: 1.5;
    max-height: 120px;
    padding: 8px 12px;
    color: #4b4646;
}

textarea::placeholder {
    color: #9CA3AF;
}

.text-indicator {
    display: flex;
    justify-content: flex-end;
}

.current-count {
    font-weight: 400;
    font-size: small;
    color: #9CA3AF;
}

.send-button {

    background: #f50029;
    color: #fffaf8;

    border: none;
    border-radius: 12px;

    padding: 11px 18px;
    cursor: pointer;
    white-space: nowrap;

    transition:
        background 0.2s,
        transform 0.1s;
}

.send-button:hover {
    background: #b97d88;
}

.send-button:active {
    transform: scale(0.97);
}

button:hover {
    background-color: #f0f0f0;
}
</style>
