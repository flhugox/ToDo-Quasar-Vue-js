<template>
  <div class="q-pa-md q-gutter-sm">
    <q-editor
      v-if="!modoEdicion"
      v-model="editor"
      :definitions="{
        save: {
          tip: 'Guardar',
          icon: 'save',
          label: 'Guardar Todo',
          handler: saveWork
        }
      }"
      :toolbar="[
        ['bold', 'italic', 'strike', 'underline'],
        ['upload', 'save']
      ]"
    />
    <q-editor
      v-else
      v-model="editor"
      :definitions="{
        save: {
          tip: 'Actualizar',
          icon: 'save',
          label: 'Actualizar Todo',
          handler: updateWork
        }
      }"
      :toolbar="[
        ['bold', 'italic', 'strike', 'underline'],
        ['upload', 'save']
      ]"
    />
    <q-card class="row" flat bordered v-for="(item, index) in tasks" :key="index">
      <q-card-section :class="item.estado ? 'tachar' : ''" class="col" v-html="item.texto" />
      <q-btn flat color="blue" @click="item.estado = !item.estado">Accion</q-btn>
      <q-btn flat color="yellow" @click="editar(index, item.id)">Editar</q-btn>
      <q-btn flat color="red" @click="eliminar(index, item.id)">Elimianr</q-btn>
    </q-card>
    <div class="flex flex-center" v-if="tasks.length == 0">
      <h6>Sin Notas</h6>
    </div>
  </div>
</template>

<script>
import { db } from "boot/firebase";
export default {
  data() {
    return {
      editor: "",
      tasks: [],
      index: null,
      modoEdicion: false,
      id: null
    };
  },
  created() {
    this.listarTares();
  },
  methods: {
    async listarTares() {
      try {
        const resDB = await db.collection("tareas").get();
        resDB.forEach(res => {
          const tarea = {
            id: res.id,
            texto: res.data().texto,
            estado: res.data().estado
          };
          this.tasks.push(tarea);
        });
      } catch (error) {}
    },
    async saveWork() {
      try {
        const resDB = await db.collection("tareas").add({
          texto: this.editor,
          estado: false
        });
        this.tasks.push({
          texto: this.editor,
          estado: false,
          id: resDB.id
        });
        this.editor = "";
        this.$q.notify({
          message: "Tarea Guardada",
          color: "green-4",
          textColor: "white",
          icon: "cloud_done"
        });
      } catch (error) {
        console.log(error);
      }
    },
    eliminar(index, id) {
      this.$q
        .dialog({
          title: "Accion Eliminar",
          message: "Estas Seguro que quieres eliminar este registro?",
          cancel: true,
          persistent: true
        })
        .onOk(async () => {
          try {
            await db
              .collection("tareas")
              .doc(id)
              .delete();
          } catch (error) {}
          this.tasks.splice(index, 1);
        });
    },
    editar(index, id) {
      this.editor = this.tasks[index].texto;
      this.index = index;
      this.modoEdicion = true;
      this.id = id;
    },
    async updateWork() {
      try {
        //  this.$q.loading.show();
        const query = await db
          .collection("tareas")
          .doc(this.id)
          .update({
            texto: this.editor
          });

        this.tasks[this.index].texto = this.editor;
        this.index = null;
        this.modoEdicion = false;
        this.id = null;
        this.editor = "";
        this.$q.notify({
          message: "Tarea actualizada con éxito!",
          color: "dark",
          textColor: "white",
          icon: "cloud_done"
        });
      } catch (error) {
        this.$q.notify({
          message: error,
          color: "red",
          textColor: "white",
          icon: "clear"
        });
      } finally {
        //   this.$q.loading.hide();
      }
    }
  }
};
</script>
<style>
.tachar {
  text-decoration: line-through;
}
</style>
