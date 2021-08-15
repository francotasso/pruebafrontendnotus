<template>
  <div>
    <h1 class="text-2xl text-green-500">{{ title }}</h1>
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
          Hora de entrada
        </th>
        <th
          scope="col"
          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
        >
          Hora de salida
        </th>
        <th
          scope="col"
          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
        >
          Descanso
        </th>
        <th
          scope="col"
          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
        >
          Horas trabajadas
        </th>
        <th
          scope="col"
          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
        >
          Cargo asociado
        </th>
        <th
          scope="col"
          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
        >
          Sucursales asociadas
        </th>
      </template>
      <template v-slot:tbody>
        <tr v-for="tt in turnTemplateList" :key="`tt-${tt.id}`">
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="flex items-center">
              <div class="text-sm font-medium text-gray-900">
                {{ tt.name }}
              </div>
            </div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm text-gray-900">
              {{ tt.checkIn }}
            </div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm text-gray-900">
              {{ tt.checkOut }}
            </div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {{ tt.breakTime }} min
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            Vacío
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {{ tt.position }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            <span v-for="(location, idx) in tt.locations" :key="location">
              {{ location }}
              <span v-if="idx < tt.locations.length - 1">, </span>
            </span>
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
  name: 'TurnTemplatesPage',
  components: {
    TheListTable,
  },
  data() {
    return {
      title: 'Plantillas',
      turnTemplateList: [],
    };
  },
  async mounted() {
    this.init();
  },
  methods: {
    ...mapActions('location', ['GET_LOCATIONS']),
    ...mapActions('position', ['GET_POSITIONS']),
    ...mapActions('turnTemplate', ['GET_TURN_TEMPLATES']),
    async init() {
      const [locations, positions, turnTemplates] = await Promise.all([
        this.GET_LOCATIONS(),
        this.GET_POSITIONS(),
        this.GET_TURN_TEMPLATES(),
      ]);
      const locationsMap = new Map(locations.map(({ id, name }) => [id, name]));
      const positionsMap = new Map(positions.map(({ id, name }) => [id, name]));
      this.turnTemplateList = this.convertRefToVal({
        locationsMap,
        positionsMap,
        turnTemplates,
      });
    },
    convertRefToVal({ locationsMap, positionsMap, turnTemplates }) {
      const turnTemplatesCopy = this.deepClone(turnTemplates);
      return turnTemplatesCopy.map((tt) => {
        if (tt?.locationId?.length) {
          tt['locations'] = [];
          tt.locationId.forEach((id) => {
            tt.locations.push(locationsMap.get(id));
          });
        }
        if (tt?.positionId) {
          tt['position'] = positionsMap.get(tt.positionId);
        }
        const {
          id,
          breakTime,
          checkIn,
          checkOut,
          locations,
          name,
          position,
        } = tt;
        return {
          id,
          breakTime,
          checkIn,
          checkOut,
          locations,
          name,
          position,
        };
      });
    },
  },
};
</script>
