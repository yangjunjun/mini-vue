<template>
<div>
    <button @click="flag = !flag">click</button>
    <KeepAlive>
        <Child1 v-if="flag"></Child1>
        <Child2 v-else></Child2>
    </KeepAlive>
</div>
</template>
<script setup>
const flag = ref(true)
</script>
<style lang="scss" scoped>
</style>
