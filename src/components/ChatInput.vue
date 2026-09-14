<script setup>
import api from '../services/api';
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue';
import { useLobbyStore } from '../stores/lobby';
import { storeToRefs } from 'pinia'
import data from '@emoji-mart/data'
import { Picker } from 'emoji-mart'

new Picker({
    data,
    onEmojiSelect: console.log
})

const emojiPickerContainer = ref(null);


const props = defineProps({
    code: {
        type: String,
        required: true
    },
    sender: {
        type: String,
        required: true
    },
    sendTyping: {
        type: Function,
        required: true
    }
});

const store = useLobbyStore()

const { lobbyCode, currentParticipant, participants } = storeToRefs(store);

const showEmojiPicker = ref(false);
const emojiPicker = ref(null);
const textarea = ref(null);

const MAX_LIMIT = 255

const message = ref('');
const dbLength = computed(() => message.value.length);


function sendMessage() {


    showEmojiPicker.value = false;

    api.post(`/api/chat-messages/${props.code}`, {
        message: message.value,
        sender: props.sender,
        participantId: currentParticipant.value.id

    }).then(response => {
        console.log('Message sent:', response.data);
        message.value = ''; // Clear the input field after sending
    }).catch(error => {
        console.error('Error sending message:', error);
    });
}

function toggleEmojiPicker() {
    showEmojiPicker.value = !showEmojiPicker.value;

    if (showEmojiPicker.value) {
        nextTick(() => {
            createEmojiPicker();
        });
    }
}

function createEmojiPicker() {
    if (!emojiPickerContainer.value) {
        return;
    }

    // Don't create another picker if one already exists
    if (emojiPickerContainer.value.children.length > 0) {
        return;
    }

    const picker = new Picker({
        data,
        onEmojiSelect: handleEmojiClick
    });

    emojiPickerContainer.value.appendChild(picker);
}



function handleEmojiClick(emoji) {
    const emojiText = emoji.native;
    const el = textarea.value;

    if (!el) {
        message.value += emojiText;
        return;
    }

    const start = el.selectionStart;
    const end = el.selectionEnd;

    message.value =
        message.value.slice(0, start) +
        emojiText +
        message.value.slice(end)

    // Put cursor immediately after the inserted emoji
    nextTick(() => {
        const newPosition = start + emojiText.length;

        el.focus();
        el.setSelectionRange(newPosition, newPosition);
    });
}

watch(showEmojiPicker, async (visible) => {
    if (!visible) return;

    await nextTick();

    emojiPicker.value?.addEventListener(
        'emoji-click',
        handleEmojiClick
    );
});

// const { sendTyping } = useTyping(lobbyCode);

let lastTyping = 0;

function handleInput() {
    const now = Date.now();

    if (now - lastTyping < 1500) {
        return;
    }

    lastTyping = now;

    props.sendTyping();
}

</script>

<template>

    <div class="chat-input">
        <div class="input-wrapper">
            <div class="text-indicator">
                <div class="emoji-wrapper">
                    <button type="button" class="emoji-button" @click="toggleEmojiPicker">
                        😀
                    </button>

                    <div v-if="showEmojiPicker" ref="emojiPickerContainer" class="emoji-picker"></div>
                </div>

                <span class="current-count">{{ dbLength }}/{{ MAX_LIMIT }} space used </span>
            </div>
            <textarea type="text" v-model="message" @input="handleInput" :maxlength="MAX_LIMIT" ref="textarea"
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
    align-items: center;

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
    justify-content: flex-start;
    align-items: center;
    gap: 8px;
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

    padding: 16px 18px;
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

.emoji-wrapper {
    position: relative;

}

.emoji-button {
    border: none;
    background: transparent;
    cursor: pointer;
    font-size: 18px;
}

.emoji-picker {
    position: absolute;
    bottom: 45px;
    left: 0;
    z-index: 1000;
}
</style>
