<template>
  <div>
    <div
      v-if="show"
      class="min-w-screen h-screen animated fadeIn faster fixed left-0 top-0 flex justify-center items-center inset-0 z-50 outline-none focus:outline-none bg-no-repeat bg-center bg-cover"
      id="modal-id"
    >
      <div class="absolute bg-black opacity-50 inset-0 z-0"></div>
      <div
        class="w-full max-w-2xl p-5 relative mx-auto my-auto rounded-xl shadow-lg bg-white"
      >
        <!--content-->
        <div>
          <!--body-->
          <slot></slot>
          <!--footer-->
          <slot name="actions">
            <div class="p-3 mt-2 text-center space-x-4 md:block">
              <button
                class="mb-2 md:mb-0 bg-white px-5 py-2 text-sm shadow-sm font-medium tracking-wider border text-gray-600 rounded-full hover:shadow-lg hover:bg-gray-100"
                @click="$emit('cancel')"
              >
                Cancelar
              </button>
              <button
                class="mb-2 md:mb-0 bg-green-500 border border-green-500 px-5 py-2 text-sm shadow-sm font-medium tracking-wider text-white rounded-full hover:shadow-lg hover:bg-green-600"
                @click="$emit('edit')"
              >
                {{ actionName }}
              </button>
            </div>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TheModalEdit',
  props: ['show', 'actionName'],
  model: {
    prop: 'show',
  },
};
</script>
