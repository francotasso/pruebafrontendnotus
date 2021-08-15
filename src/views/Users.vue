<template>
  <div>
    <div class="w-full flex justify-between mb-4">
      <h1 class="text-2xl text-red-400">{{ title }}</h1>
      <button
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        @click="showEditModal = true"
      >
        Agregar usuario
      </button>
    </div>
    <the-list-table>
      <template v-slot:thead>
        <th
          scope="col"
          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
        >
          Nombre completo
        </th>
        <th
          scope="col"
          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
        >
          Cargos
        </th>
        <th
          scope="col"
          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
        >
          Sucursales
        </th>
        <th
          scope="col"
          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
        >
          Horas/semana
        </th>
        <th
          scope="col"
          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
        >
          Acción
        </th>
      </template>
      <template v-slot:tbody>
        <tr v-for="user in userList" :key="`user-${user.id}`">
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="flex items-center">
              <div v-if="user.avatarUrl" class="flex-shrink-0 h-10 w-10">
                <img
                  class="h-10 w-10 rounded-full"
                  :src="user.avatarUrl"
                  alt=""
                />
              </div>
              <div :class="{ 'ml-4': user.avatarUrl }">
                <div class="text-sm font-medium text-gray-900">
                  {{ user.firstName }} {{ user.lastName }}
                </div>
                <div class="text-sm text-gray-500">
                  {{ user.email }}
                </div>
              </div>
            </div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm text-gray-900">
              <span v-for="(position, idx) in user.positions" :key="position">
                {{ position }}
                <span v-if="idx < user.positions.length - 1">, </span>
              </span>
            </div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm text-gray-900">
              <span v-for="(location, idx) in user.locations" :key="location">
                {{ location }}
                <span v-if="idx < user.locations.length - 1">, </span>
              </span>
            </div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {{ user.contract }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            <button
              class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 mx-2 rounded"
              @click="openEditModal(user.id)"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
            </button>
            <button
              class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 mx-2 rounded"
              @click="openRemoveModal(user.id)"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </td>
        </tr>
        <the-modal-edit
          v-model="showEditModal"
          :action-name="idToEdit ? 'Guardar' : 'Crear'"
          @cancel="cancelEditUser"
          @edit="editUser"
        >
          <p class="text-gray-500 text-xs mb-4">Campos requeridos (*)</p>
          <form class="w-full max-w-2xl">
            <div class="flex flex-wrap -mx-3 mb-6">
              <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                <label
                  class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  for="grid-first-name"
                >
                  Nombre (*)
                </label>
                <!-- border-red-500 -->
                <input
                  class="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                  :class="{
                    'border-red-500':
                      activeValidations &&
                      !validRequiredFields &&
                      !validFirstName,
                  }"
                  id="grid-first-name"
                  type="text"
                  v-model="userToEdit.firstName"
                />
                <!-- <p class="text-red-500 text-xs italic">
                  Please fill out this field.
                </p> -->
              </div>
              <div class="w-full md:w-1/2 px-3">
                <label
                  class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  for="grid-last-name"
                >
                  Apellido (*)
                </label>
                <input
                  class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  :class="{
                    'border-red-500':
                      activeValidations &&
                      !validRequiredFields &&
                      !validLastName,
                  }"
                  id="grid-last-name"
                  type="text"
                  v-model="userToEdit.lastName"
                />
              </div>
            </div>
            <div class="flex flex-wrap -mx-3 mb-6">
              <div class="w-full md:w-1/2 px-3">
                <label
                  class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  for="grid-birth"
                >
                  Fecha de nacimiento (*)
                </label>
                <input
                  class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  :class="{
                    'border-red-500':
                      activeValidations &&
                      !validRequiredFields &&
                      !validDateOfBirth,
                  }"
                  id="grid-birth"
                  type="date"
                  v-model="userToEdit.dateOfBirth"
                />
              </div>
              <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                <label
                  class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  for="grid-position"
                >
                  Cargo
                </label>
                <div class="relative">
                  <select
                    class="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="grid-position"
                    v-model="userToEdit.positionId[0]"
                  >
                    <option
                      v-for="position in positionList"
                      :key="`position-${position.id}`"
                      :value="position.id"
                    >
                      {{ position.name }}
                    </option>
                  </select>
                  <div
                    class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"
                  >
                    <svg
                      class="fill-current h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path
                        d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            <div class="flex flex-wrap -mx-3 mb-6">
              <div class="w-full px-3">
                <label
                  class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  for="grid-email"
                >
                  Correo electrónico (*)
                </label>
                <input
                  class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  :class="{
                    'border-red-500':
                      activeValidations && !validRequiredFields && !validEmail,
                  }"
                  id="grid-email"
                  type="email"
                  v-model="userToEdit.email"
                />
                <p v-if="wrongEmailFormat" class="text-red-500 text-xs">
                  Ingrese un formato válido de correo electrónico
                </p>
              </div>
            </div>
            <div class="flex flex-wrap -mx-3 mb-6">
              <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                <label
                  class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  for="grid-id"
                >
                  Id (*)
                </label>
                <input
                  class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  :class="{
                    'border-red-500':
                      activeValidations && !validRequiredFields && !validId,
                  }"
                  id="grid-id"
                  type="text"
                  v-model="userToEdit.id"
                />
              </div>
              <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                <label
                  class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  for="grid-employeeId"
                >
                  Código de empleado (*)
                </label>
                <input
                  class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  :class="{
                    'border-red-500':
                      activeValidations &&
                      !validRequiredFields &&
                      !validEmployeeId,
                  }"
                  id="grid-employeeId"
                  type="text"
                  v-model="userToEdit.employeeId"
                />
              </div>
            </div>
            <div class="flex flex-wrap -mx-3 mb-6">
              <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                <label
                  class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  for="grid-contract"
                >
                  Contrato (*)
                </label>
                <div class="relative">
                  <select
                    class="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    :class="{
                      'border-red-500':
                        activeValidations &&
                        !validRequiredFields &&
                        !validContract,
                    }"
                    id="grid-position"
                    v-model="userToEdit.contract"
                  >
                    <option
                      v-for="contract in contractList"
                      :key="`contract-${contract.id}`"
                      :value="contract.id"
                    >
                      {{ contract.name }}
                    </option>
                  </select>
                  <div
                    class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"
                  >
                    <svg
                      class="fill-current h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path
                        d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <div class="w-full md:w-1/2 px-3">
                <label
                  class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  for="grid-email"
                >
                  Sucursal
                </label>
                <div class="relative">
                  <select
                    class="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="grid-position"
                    v-model="userToEdit.locationId[0]"
                  >
                    <option
                      v-for="location in locationList"
                      :key="`location-${location.id}`"
                      :value="location.id"
                    >
                      {{ location.name }}
                    </option>
                  </select>
                  <div
                    class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"
                  >
                    <svg
                      class="fill-current h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path
                        d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </the-modal-edit>
        <the-modal-remove
          v-model="showDeleteModal"
          @cancel="cancelRemoveUser"
          @remove="removeUser"
        ></the-modal-remove>
      </template>
    </the-list-table>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import TheListTable from '@/components/TheListTable.vue';

export default {
  name: 'UsersPage',
  components: {
    TheListTable,
    TheModalRemove: () => import('../components/TheModalRemove.vue'),
    TheModalEdit: () => import('../components/TheModalEdit.vue'),
  },
  data() {
    return {
      title: 'Vista de Usuarios',
      userList: [],
      usersMap: null,
      showDeleteModal: false,
      showEditModal: false,
      idToDelete: null,
      idToEdit: null,
      userToEdit: {
        positionId: [],
        locationId: [],
      },
      contractList: null,
      locationList: null,
      positionList: null,
      activeValidations: false,
      wrongEmailFormat: false,
    };
  },
  async mounted() {
    this.init();
  },
  computed: {
    validId() {
      return !!this.userToEdit.id;
    },
    validContract() {
      return !!this.userToEdit.contract;
    },
    validDateOfBirth() {
      return !!this.userToEdit.dateOfBirth;
    },
    validEmail() {
      return !!this.userToEdit.email;
    },
    validEmployeeId() {
      return !!this.userToEdit.employeeId;
    },
    validFirstName() {
      return !!(this.userToEdit.firstName && this.userToEdit.firstName.trim());
    },
    validLastName() {
      return !!(this.userToEdit.lastName && this.userToEdit.lastName.trim());
    },
    validRequiredFields() {
      const {
        id,
        contract,
        dateOfBirth,
        email,
        employeeId,
        firstName,
        lastName,
      } = this.userToEdit;
      return !!(
        id &&
        contract &&
        dateOfBirth &&
        email &&
        employeeId &&
        firstName &&
        firstName.trim() &&
        lastName &&
        lastName.trim()
      );
    },
  },
  methods: {
    ...mapActions('contract', ['GET_CONTRACTS']),
    ...mapActions('location', ['GET_LOCATIONS']),
    ...mapActions('position', ['GET_POSITIONS']),
    ...mapActions('user', [
      'GET_USERS',
      'CREATE_USER',
      'EDIT_USER',
      'REMOVE_USER',
    ]),
    async init() {
      const [contracts, locations, positions, users] = await Promise.all([
        this.GET_CONTRACTS(),
        this.GET_LOCATIONS(),
        this.GET_POSITIONS(),
        this.GET_USERS(),
      ]);
      const contractsMap = new Map(
        contracts.map(({ id, name, legalMaxWeeklyHours }) => [
          id,
          `${legalMaxWeeklyHours}/${name}`,
        ])
      );
      const locationsMap = new Map(locations.map(({ id, name }) => [id, name]));
      const positionsMap = new Map(positions.map(({ id, name }) => [id, name]));
      this.positionList = this.deepClone(positions);
      this.contractList = this.deepClone(contracts);
      this.locationList = this.deepClone(locations);
      const usersCopy = this.deepClone(users);
      this.usersMap = new Map(usersCopy.map((user) => [user.id, user]));
      const sortedUsers = users.sort(
        ({ employeeId: id1 }, { employeeId: id2 }) => {
          return id1 > id2;
        }
      );
      this.userList = this.convertRefToVal({
        contractsMap,
        locationsMap,
        positionsMap,
        sortedUsers,
      });
    },
    convertRefToVal({ contractsMap, locationsMap, positionsMap, sortedUsers }) {
      const usersCopy = this.deepClone(sortedUsers);
      return usersCopy.map((user) => {
        if (user?.contract) {
          const id = user.contract;
          user['contract'] = contractsMap.get(id);
        }
        if (user?.locationId?.length) {
          user['locations'] = [];
          user.locationId.forEach((id) => {
            user.locations.push(locationsMap.get(id));
          });
        }
        if (user?.positionId?.length) {
          user['positions'] = [];
          user.positionId.forEach((id) => {
            user.positions.push(positionsMap.get(id));
          });
        }
        const {
          avatarUrl,
          contract,
          email,
          firstName,
          id,
          lastName,
          locations,
          positions,
        } = user;
        return {
          avatarUrl,
          contract,
          email,
          firstName,
          id,
          lastName,
          locations,
          positions,
        };
      });
    },
    openEditModal(id) {
      this.idToEdit = id;
      this.userToEdit = this.usersMap.get(id);
      this.showEditModal = true;
    },
    async editUser() {
      this.activeValidations = true;
      if (this.validRequiredFields) {
        if (!this.validEmailFormat(this.userToEdit.email)) {
          this.wrongEmailFormat = true;
          setTimeout(() => {
            this.wrongEmailFormat = false;
          }, 3000);
          return;
        }
        if (this.idToEdit) await this.EDIT_USER(this.userToEdit);
        else await this.CREATE_USER(this.userToEdit);
        this.init();
        this.activeValidations = false;
        this.showEditModal = false;
      } else {
        setTimeout(() => {
          this.activeValidations = false;
        }, 3000);
      }
    },
    cancelEditUser() {
      this.showEditModal = false;
      this.idToEdit = null;
      this.$nextTick(() => {
        this.userToEdit = {
          positionId: [],
          locationId: [],
        };
      });
    },
    openRemoveModal(id) {
      this.showDeleteModal = true;
      this.idToDelete = id;
    },
    async removeUser() {
      await this.REMOVE_USER(this.idToDelete);
      this.userList = this.userList.filter(
        (user) => user.id !== this.idToDelete
      );
      this.showDeleteModal = false;
    },
    cancelRemoveUser() {
      this.showDeleteModal = false;
      this.idToDelete = null;
    },
  },
};
</script>
