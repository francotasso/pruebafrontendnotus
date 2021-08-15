<template>
  <div class="bg-gray-200 rounded-md p-3">
    <h1 class="text-2xl text-gray-800">{{ title }}</h1>
    <div class="flex flex-col space-y-10">
      <!-- <div class="w-full text-center text-gray-600 font-bold text-lg">
        <p>Ejemplo de Tabla 1 Turnos No Asignados</p>
        <img
          src="../assets/turnos-no-asignados.png"
          alt="imagen ejemplo de turnos no asignados"
        />
      </div> -->
      <div class="w-full text-gray-600 font-bold text-lg pt-6 -mb-6">
        <p>Turnos No Asignados</p>
      </div>
      <the-list-table>
        <template v-slot:thead>
          <th
            v-for="date in dates"
            :key="date"
            scope="col"
            style="font-size: 0.7rem"
            class="px-2 py-3 text-left w-24 text-xs font-extrabold font-medium text-gray-500 uppercase"
          >
            {{ date }}
          </th>
        </template>
        <template v-slot:tbody>
          <tr v-for="(gat, index) in availableTurns" :key="`gat-${index}`">
            <td
              v-for="(at, idx) in gat"
              :key="`at${index}-${idx}`"
              class="px-2 py-4 whitespace-nowrap"
            >
              <div v-if="at" class="flex items-center">
                <div class="text-sm text-gray-500" style="font-size: 0.7rem">
                  {{ at.name }}
                  <div>
                    ({{ at.checkIn }}
                    -
                    {{ at.checkOut }})
                  </div>
                </div>
              </div>
            </td>
          </tr>
        </template>
      </the-list-table>
      <!-- <div class="w-full text-center text-blue-500 font-bold text-lg">
        <p>Ejemplo de Tabla 2 Turnos Asignados</p>
        <img
          src="../assets/turnos-asignados.png"
          alt="imagen ejemplo de turnos asignados"
        />
      </div> -->
      <div class="w-full text-blue-500 font-bold text-lg">
        <p>Turnos Asignados</p>
      </div>
      <the-list-table>
        <template v-slot:thead>
          <th
            scope="col"
            style="font-size: 0.7rem"
            class="px-2 py-3 text-left w-24 text-xs font-extrabold font-medium text-gray-500 uppercase"
          >
            Turnos asignados
          </th>
          <th
            v-for="date in dates"
            :key="date"
            scope="col"
            style="font-size: 0.7rem"
            class="px-2 py-3 text-left w-24 text-xs font-extrabold font-medium text-gray-500 uppercase"
          >
            {{ date }}
          </th>
        </template>
        <template v-slot:tbody>
          <tr v-for="(at, index) in assignedTurns" :key="`gat-${index}`">
            <td
              class="px-2 py-4 text-sm text-gray-500 whitespace-nowrap"
              style="font-size: 0.7rem"
            >
              {{ at[0] }}
            </td>
            <td
              v-for="(at, idx) in at.slice(1, dates.length + 1)"
              :key="`at${index}-${idx}`"
              class="px-2 py-4 whitespace-nowrap"
            >
              <div v-if="at && at.turnTemplate" class="flex items-center">
                <div class="text-sm text-gray-500" style="font-size: 0.7rem">
                  {{ at.turnTemplate.name }}
                  <div>
                    ({{ at.turnTemplate.checkIn }}
                    -
                    {{ at.turnTemplate.checkOut }})
                  </div>
                </div>
              </div>
            </td>
          </tr>
        </template>
      </the-list-table>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import TheListTable from '@/components/TheListTable.vue';

export default {
  name: 'CalendarPage',
  components: {
    TheListTable,
  },
  data() {
    return {
      title: 'Turnos',
      availableTurns: [],
      assignedTurns: [],
      dates: [
        '2021-04-19',
        '2021-04-20',
        '2021-04-21',
        '2021-04-22',
        '2021-04-23',
        '2021-04-24',
        '2021-04-25',
        '2021-04-26',
        '2021-04-27',
        '2021-04-28',
        '2021-04-29',
        '2021-04-30',
      ],
    };
  },
  async mounted() {
    this.init();
  },
  methods: {
    ...mapActions('turn', ['GET_TURNS']),
    ...mapActions('turnTemplate', ['GET_TURN_TEMPLATES']),
    ...mapActions('user', ['GET_USERS']),
    async init() {
      const [turns, turnTemplates, users] = await Promise.all([
        this.GET_TURNS(),
        this.GET_TURN_TEMPLATES(),
        this.GET_USERS(),
      ]);
      const turnTemplatesMap = new Map(
        turnTemplates.map(({ id, checkIn, checkOut, name }) => [
          id,
          { checkIn, checkOut, name },
        ])
      );
      const usersMap = new Map(users.map((user) => [user.id, user]));
      let [availableTurns, assignedUsers] = this.divideTurns(
        turns,
        turnTemplatesMap,
        usersMap
      );
      this.calculateNotAssignedTurns(availableTurns);
      this.calculateAssignedTurns(assignedUsers);
    },
    divideTurns(turns, turnTemplatesMap, usersMap) {
      //limit dates
      const startDate = new Date('2021-04-19');
      const endDate = new Date('2021-04-30');
      let availableTurns = [];
      /* object where the keys will be the names of the users and the values will
      arrays of assigned turn related with the user name key */
      const assignedUsers = {};
      turns.forEach((turn) => {
        const date = new Date(turn.date);
        if (
          date.getTime() <= endDate.getTime() &&
          date.getTime() >= startDate.getTime()
        ) {
          //if the number of users < maxSlots, then push to available turns
          if (turn.userId.length < turn.maxSlots) {
            availableTurns.push({
              ...turn,
              turnTemplate: turnTemplatesMap.get(turn.turnTemplateId) || null,
            });
          } else {
            //if the number of users === maxSlots, then push to assigned users
            if (turn.userId && turn.userId.length) {
              turn.userId.forEach((id) => {
                const { firstName: f, lastName: l } = usersMap.get(id);
                //if the assigned user is new, create and push the first assigned turn
                if (!assignedUsers[`${f} ${l}`])
                  assignedUsers[`${f} ${l}`] = [
                    {
                      ...turn,
                      turnTemplate:
                        turnTemplatesMap.get(turn.turnTemplateId) || null,
                    },
                  ];
                // if the assigned user already exist, push the turn
                else
                  assignedUsers[`${f} ${l}`].push({
                    ...turn,
                    turnTemplate:
                      turnTemplatesMap.get(turn.turnTemplateId) || null,
                  });
              });
            }
          }
        }
      });
      const avT = this.deepClone(availableTurns);
      const asU = this.deepClone(assignedUsers);
      return [avT, asU];
    },
    calculateNotAssignedTurns(availableTurns) {
      let availableTurnsCopy = this.deepClone(availableTurns);
      availableTurnsCopy = this.sortByKey(availableTurnsCopy, 'date', true);
      /* object where the keys will be dates and the values will be arrays of
      available turns related with the key date */
      const availableTurnGroupedByDate = {};
      let maxAvailableTurns = 0;
      // push the available turns grouped by date
      availableTurnsCopy.forEach((at) => {
        if (at.turnTemplate) {
          if (!availableTurnGroupedByDate[at.date])
            availableTurnGroupedByDate[at.date] = [at];
          else availableTurnGroupedByDate[at.date].push(at);
        }
      });
      /* in order to show the data in the table, it is necessary to calculate
      the max number of available turns in one day, so we can set the number of rows */
      for (const turn of Object.entries(availableTurnGroupedByDate)) {
        if (turn[1].length > maxAvailableTurns)
          maxAvailableTurns = turn[1].length;
      }
      const availableTurnsToRows = new Array(maxAvailableTurns);
      /* convert the availableTurnGroupedByDate object to array
      in order to show the available turns */
      for (let i = 0; i < maxAvailableTurns; i++) {
        if (!availableTurnsToRows[i]) availableTurnsToRows[i] = [];
        for (const at of Object.entries(availableTurnGroupedByDate)) {
          const turn = at[1][i];
          if (turn && turn.turnTemplate) {
            availableTurnsToRows[i].push({ ...turn.turnTemplate });
          } else availableTurnsToRows[i].push(null);
        }
      }
      this.availableTurns = availableTurnsToRows;
    },
    calculateAssignedTurns(assignedUsers) {
      const assignedTurnsToRows = new Array(
        Object.entries(assignedUsers).length
      );
      const assignedUsersArray = Object.entries(assignedUsers);
      const assignedUsersLength = assignedUsersArray.length;
      for (let i = 0; i < assignedUsersLength; i++) {
        //push the full name of the user in first position
        assignedTurnsToRows[i] = [assignedUsersArray[i][0]];
        /* each assigned turn will be set from positon 1 to position n
        where n is the limit date */
        this.dates.forEach((date) => {
          //find if there are any assigned turn in the specific date
          const d = assignedUsersArray[i][1].find((a) => a.date === date);
          /* push the assigned turn or null if there are no assigned turn in
          the specific date */
          assignedTurnsToRows[i].push(d || null);
        });
      }
      this.assignedTurns = assignedTurnsToRows;
    },
  },
};
</script>
