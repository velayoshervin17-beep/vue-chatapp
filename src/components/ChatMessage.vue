<script setup>


const props = defineProps({
    message: {
        type: String,
        required: true
    },
    sender: {
        type: String,
        required: true
    },
    timestamp: {
        type: String,
        required: true
    },
    isOwnMessage: {
        type: Boolean,
    }
});




</script>

<template>

    <div class="chat-message" :class="{ 'align-right': isOwnMessage }">
        <div class="sender">{{ sender }}</div>
        <div class="bubble" :class="{ yours: isOwnMessage, others: !isOwnMessage }">
            {{ message }}
            <div class="timestamp">{{ timestamp }}</div>
        </div>
    </div>

</template>

<style scoped>
.chat-message {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    /* Other players align to the left side */
    width: 100%;
}

.chat-message.align-right {
    align-items: flex-end;
}



.bubble {
    /* background: #ec4899; */

    display: block;
    width: fit-content;
    padding: 10px 14px;
    border-radius: 12px;
    max-width: 75%;
    word-break: break-word;
    font-size: 0.95rem;
    color: white;


}

.others {
    background: #ec4899;
}

.yours {
    background: #6057e7;
}



.sender {
    font-size: 0.75rem;
    color: #6b7280;
    margin-bottom: 2px;
    font-weight: bold;
    /* font-weight: bold;
    margin-bottom: 5px; */
}

.timestamp {
    /* font-size: 0.8em;
    color: #999;
    text-align: right; */

    font-size: 0.65rem;
    color: rgba(255, 255, 255, 0.7);
    text-align: right;
    margin-top: 4px;

    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.4);
}
</style>