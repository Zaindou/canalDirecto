<template>
    <div class="d-flex justify-center logo-container">
        <img src="/logo.png" alt="Logo" class="logo-img">
    </div>
</template>
<style scoped>
.logo-container {
    margin-bottom: 20px;
}

.logo-img {
    max-width: 30%;
    height: auto;
}

@media (max-width: 600px) {
    .logo-img {
        max-width: 60%;
    }
}
</style>