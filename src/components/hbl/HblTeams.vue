<script setup lang="ts"></script>

<template>
  <div class="container">
    <table class="table table-striped" v-show="!loading">
      <thead>
        <tr>
          <th>Team Name</th>
          <th>Manager</th>
        </tr>
      </thead>
      <tbody class="align-middle">
        <tr v-for="team in this.teams" :key="team.id">
          <td>
            <a :href="`roster/${team.team_id}`">{{ team.name }}</a>
          </td>
          <td>{{ team.manager.nickname }}</td>
        </tr>
      </tbody>
    </table>
    <span v-show="loading" class="spinner-border spinner-border-sm" />
  </div>
</template>

<style scoped></style>
