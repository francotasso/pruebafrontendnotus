<template>
  <div>
    <h1 class="text-2xl text-purple-600">{{ title }}</h1>
    <the-list-table>
      <template v-slot:thead>
        <th
          scope="col"
          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
        >
          Nombre
        </th>
        <th
          scope="col"
          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
        >
          Horario(entrada/salida)
        </th>
        <th
          scope="col"
          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
        >
          Dirección
        </th>
        <th
          scope="col"
          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
        >
          N° de usuarios
        </th>
      </template>
      <template v-slot:tbody>
        <tr v-for="location in locationList" :key="`location-${location.id}`">
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="flex items-center">
              <div class="ml-4">
                <div class="text-sm font-medium text-gray-900">
                  {{ location.name }}
                </div>
              </div>
            </div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm text-gray-900">
              <span>{{ location.startTime }} / </span>
              <span>{{ location.endTime }}</span>
            </div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm text-gray-900">
              <span>{{ location.address1 }}/</span>
              <span v-if="location.address2">{{ location.address2 }}/</span>
              <span>{{ location.commune }}/</span>
              <span>{{ location.region }}</span>
            </div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {{ location.nbOfEmployees }}
          </td>
        </tr>
      </template>
    </the-list-table>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import TheListTable from '@/components/TheListTable.vue';

export default {
  name: 'LocationsPage',
  components: {
    TheListTable,
  },
  data() {
    return {
      title: 'Sucursales',
      locationList: [],
    };
  },
  async mounted() {
    this.init();
  },
  methods: {
    ...mapActions('location', ['GET_LOCATIONS']),
    ...mapActions('user', ['GET_USERS']),
    async init() {
      const [locations, users] = await Promise.all([
        this.GET_LOCATIONS(),
        this.GET_USERS(),
      ]);
      const locationsMap = new Map(
        locations.map((location) => [
          location.id,
          { ...location, nbOfEmployees: 0 },
        ])
      );
      users.forEach((user) => {
        user.locationId.forEach((id) => {
          const currentLocation = locationsMap.get(id);
          if (currentLocation) {
            const { nbOfEmployees } = currentLocation;
            locationsMap.set(id, {
              ...currentLocation,
              nbOfEmployees: nbOfEmployees + 1,
            });
          }
        });
      });
      const locationsArray = Array.from(locationsMap, ([, value]) => ({
        ...value,
      }));
      this.locationList = this.sortByKey(locationsArray, 'name', false, true);
    },
  },
};
</script>
