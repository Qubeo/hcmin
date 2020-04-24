<template>
  <div>
    <table>
      <tr>
        <th>Addr</th>
        <th>Created at</th>
        <th>Title</th>
        <th>Content</th>
      </tr>
      <tr v-if="props.ptItem">
        <td style="font-size:11px">{{ props.ptItem.id }}</td>
        <td style="font-size:11px">{{ props.ptItem.createdAt }}</td>
        <td>{{ props.ptItem.title }}</td>
        <td>{{ props.ptItem.content }}</td>
      </tr>
    </table>
  </div>
</template>

<script>
/*eslint no-unused-vars: "warn"*/

export default {
  name: "PtCard",
  props: {
    ptItem: Object
  },

  setup(props, context) {
    console.log("PtCard: props.ptItem: ");
    console.log(props.ptItem);

    return {
      props
    };
  }
};
</script>

<style scoped>
table {
  font-family: "Work Sans";
  font-size: 14px;
}

td {
  padding: 4px;
}
</style>
