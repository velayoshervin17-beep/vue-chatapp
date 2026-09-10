<script setup>

import { useRoute, useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';
import ChatBox from './ChatBox.vue';
import { useLobbyStore } from '../stores/lobby';
import { storeToRefs } from 'pinia'
import api from '../services/api'


const store = useLobbyStore()
const { lobbyCode, currentParticipant, participants } = storeToRefs(store);

const route = useRoute();
const router = useRouter();

const code = ref(route.params.code); // Gets 'ABC123'

const participant = currentParticipant.value;


console.log('current_participants:', participants.value);

const payload = {
    participant: participant?.sender,
    id: participant?.id,
}



function leaveLobby() {

    const result = api.post(`api/lobby/leave/${code.value}`, payload).
        then((res) => {

            //remove the participant fron the participant list
            if (currentParticipant.value) {
                participants.value = participants.value.filter(
                    player => player.id !== currentParticipant.value.id
                );
            }
            console.log(`${participant?.sender} has left the lobby`, res.data);
            //sent then to home page
            router.push('/');
        }).
        catch(error => {
            if (error.response) {
                // The server responded with a status code outside the 2xx range
                console.error('Laravel Error Details:', error.response.data);
            } else {
                console.error('Network or Setup Error:', error.message);
            }
        });
}




onMounted(() => {

});


</script>



<template>
    <div class="lobby-wrapper">
        <h1>Welcome to Lobby: {{ lobbyCode }}</h1>
        <div v-if="participant">
            <p>Player Name: {{ participant.sender }}</p>
            <p>Player Database ID: {{ participant.id }}</p>
        </div>
        <p v-else>Loading player data...</p>

        <div class="btn-wrapper">
            <button class="my-btn" @click="leaveLobby">Leave</button>
        </div>
    </div>
    <div>

        <ChatBox />

    </div>

</template>

<style scoped>
.btn-wrapper {
    display: flex;
    justify-content: right;
}

.my-btn {
    background-color: rgb(235, 55, 55);
    color: white;
    padding: 10px 15px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    position: right;
    margin: 10px 0px;
}

.my-btn:hover {
    background-color: rgb(200, 40, 40);
}
</style>