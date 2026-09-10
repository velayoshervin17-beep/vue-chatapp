<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useLobbyStore } from '../stores/lobby';
import api from '../services/api';

const store = useLobbyStore()
const code = ref('');
const playername = ref('');
const router = useRouter();


const joinRoom = () => {
    console.log(`Joining room with code: ${code.value} and player name: ${playername.value}`);
    const payload = {
        participant: playername.value
    };
    api.post(`/api/lobby/join/${code.value}`, payload, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json' // Forces Laravel to send errors back as JSON instead of HTML redirects
        }
    })
        .then(response => {
            console.log('Successfully recorded in phpMyAdmin:', response.data);

            const currentParticipant = response.data.participant;

            const initialData = {
                code: code.value,
                id: currentParticipant.id,
                in_game_name: currentParticipant.in_game_name,
                lobby_status: currentParticipant.lobby_status,
                created_at: currentParticipant.created_at
            }

            store.initializeLobby(initialData)

            router.push({
                name: 'lobby',
                params: { code: code.value },
            });

        })
        .catch(error => {
            if (error.response) {
                // The server responded with a status code outside the 2xx range
                console.error('Laravel Error Details:', error.response.data);
            } else {
                console.error('Network or Setup Error:', error.message);
            }
        });
};

defineExpose({
    joinRoom
});

</script>

<template>


    <div>
        <form @submit.prevent="joinRoom" class="joinForm">
            <p>Join a Room </p>
            <label for="code">Room Code:</label>
            <input type="text" required v-model="code" name="code">
            <label for="playername">Player Name:</label>
            <input type="text" required v-model="playername" name="playername" placeholder="Enter your player name"
                class="playername-input">
            <button type="submit">Join Room</button>
        </form>
    </div>


</template>

<style scoped>
.joinForm {
    display: flex;
    flex-direction: column;
    width: 300px;
    margin: 0 auto;
    gap: 10px;
}

.playername-input {
    margin-bottom: 10px;
    padding: 5px;
}
</style>