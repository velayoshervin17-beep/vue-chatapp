<script setup>

import { ref } from 'vue'

import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';


const router = useRouter();

const auth = useAuthStore()


const credentials = ref({
    email: '',
    password: ''
})


async function handleSubmit() {
    try {
        await auth.login(credentials.value)

        console.log('Logged in:', auth.user)

        router.push({
            name: 'join-room'
        })
    } catch (err) {
        console.error(err)
    }
}


</script>

<template>
    <form @submit.prevent="handleSubmit" class="myForm">
        <div class="inputs">
            <label for="email:">Email:</label>
            <input type="email" name="email" v-model="credentials.email">
        </div>
        <div class="inputs">
            <label for="password">Password</label>
            <input type="password" name="password" v-model="credentials.password">
        </div>
        <button type="submit">Login</button>
    </form>
</template>

<style scoped>
.inputs {
    display: flex;
    gap: 5px;
}

.myForm {
    display: flex;
    flex-direction: column;
    gap: 10px;
}
</style>