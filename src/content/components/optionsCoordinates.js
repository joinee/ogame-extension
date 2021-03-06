var optionsCoordinates = Vue.extend({
  props: ['storage'],
  template: `
    <tr>
      <td class="c" colspan="2">{{translate.title}}</td>
    </tr>
    <tr>
      <th>{{translate.active}}:</th>
      <th>
        <select v-model="localStorage.CoordsShortcutActive"
                @change="storageUpdated"
                name="extension-active">
          <option value="false">{{translate.off}}</option>
          <option value="true">{{translate.on}}</option>
        </select>
      </th>
    </tr>
    <tr v-for="player in localStorage.CoordsShortcutPlayers">
      <th colspan="2">
        <table style="width: 400px; margin: 0 auto;">
          <tbody>
            <tr>
              <td class="c" colspan="3">
                <span style="float: left;">{{player.name}}</span>
                <span style="float: right; margin-right: 2px;">
                  <a href="#" @click="removePlayer(player.name)">{{translate.deletePlayer}}</a>
                </span>
              </td>
            </tr>
            <tr>
              <th>Planet Name</th>
              <th>Coordinates</th>
              <th>Actions</th>
            </tr>
            <tr v-for="planet in player.planets">
              <th>{{planet.name}}</th>
              <th>
                <input  v-model="planet.galaxy"
                        @change="storageUpdated"
                        type="number"
                        style="text-align: center; width: 30px; margin-right: 5px;">:
                <input  v-model="planet.system"
                        @change="storageUpdated"
                        type="number"
                        style="text-align: center; width: 50px; margin-right: 5px;">:
                <input  v-model="planet.planet"
                        @change="storageUpdated"
                        type="number"
                        style="text-align: center; width: 30px;">
              </th>
              <th>
                <a href="#" @click="removePlanet(player.name, planet.name)">{{translate.delete}}</a>
              </th>
            </tr>
            <tr>
              <th>
                <input  v-model="newPlanet.name"
                        type="text">
              </th>
              <th>
                <input  v-model="newPlanet.galaxy"
                        type="number"
                        style="text-align: center; width: 30px; margin-right: 5px;">:
                <input  v-model="newPlanet.system"
                        type="number"
                        style="text-align: center; width: 50px; margin-right: 5px;">:
                <input  v-model="newPlanet.planet"
                        type="number"
                        style="text-align: center; width: 30px;">
              </th>
              <th>
                <a href="#" @click="addNewPlanet(player.name, newPlanet)">{{translate.addPlanet}}</a>
              </th>
            </tr>
          </tbody>
        </table>
      </th>
    </tr>
    <tr>
      <th colspan="2">
        <table style="width: 400px; margin: 0 auto;">
          <tbody>
            <tr>
              <td class="c" colspan="3">{{newPlayer.name || translate.newPlayer}}</td>
            </tr>
            <tr>
              <th>{{translate.playerName}}:</th>
              <th>
                <input  v-model="newPlayer.name"
                        type="text">
              </th>
              <th>
                <a href="#" @click="addNewPlayer(newPlayer)">{{translate.addPlayer}}</a>
              </th>
            </tr>
          </tbody>
        </table>
      </th>
    </tr>
  `,
  data: function() {
    return {
      localStorage: {
        CoordsShortcutActive: 'false',
        CoordsShortcutPlayers: []
      },
      newPlanet: {
        name: '',
        galaxy: '',
        system: '',
        planet: ''
      },
      newPlayer: {
        name: '',
        planets: []
      },
      dictionary: {
        "en": {
          title: 'Coordinates Shortcuts',
          active: 'Autologin active',
          off: 'off',
          on: 'on',
          deletePlayer: 'Delete player',
          delete: 'Delete',
          addPlanet: 'Add planet',
          newPlayer: 'New player name',
          playerName: 'Player name',
          addPlayer: 'Add player'
        },
        "pl": {
          title: 'Skróty koordynatów',
          active: 'Skróty aktywne',
          off: 'wyłączone',
          on: 'włączone',
          deletePlayer: 'Usuń gracza',
          delete: 'Usuń',
          addPlanet: 'Dodaj planetę',
          newPlayer: 'Nazwa nowego użytkownika',
          playerName: 'Nazwa użytkownika',
          addPlayer: 'Dodaj gracza'
        }
      }
    };
  },
  computed: {
    translate: function() {
      return this.dictionary[this.storage.Language || "en"];
    }
  },
  methods: {
    storageUpdated: function() {
      $.extend(true, this.storage, this.localStorage);
    },
    removePlanet: function(playerName, planetName) {
      let playerIndex = this.findIndexByName(this.localStorage.CoordsShortcutPlayers, playerName);
      let planetIndex = this.findIndexByName(this.localStorage.CoordsShortcutPlayers[playerIndex].planets, planetName);
      this.localStorage.CoordsShortcutPlayers[playerIndex].planets.splice(planetIndex, 1);
      this.storageUpdated();
    },
    addNewPlanet: function(playerName, {name, galaxy, system, planet}) {
      let playerIndex = this.findIndexByName(this.localStorage.CoordsShortcutPlayers, playerName);
      this.localStorage.CoordsShortcutPlayers[playerIndex].planets.push({ name, galaxy, system, planet });
      this.storageUpdated();
      this.newPlanet = {
        name: '',
        galaxy: '',
        system: '',
        planet: ''
      };
    },
    removePlayer: function(playerName) {
      let playerIndex = this.findIndexByName(this.localStorage.CoordsShortcutPlayers, playerName);
      this.localStorage.CoordsShortcutPlayers.splice(playerIndex, 1);
      this.storageUpdated();
    },
    addNewPlayer: function({name}) {
      this.localStorage.CoordsShortcutPlayers.push({name, planets: []});
      this.storageUpdated();
      this.newPlayer = {
        name: '',
        planets: []
      };
    },
    findIndexByName: function(array, name) {
      for(let i = 0; i < array.length; i++) {
        if(array[i].name === name) {
          return i;
        }
      }
    }
  },
  ready: function() {
    OE.Storage.ready(() => {
      this.localStorage.CoordsShortcutActive = OE.Storage.get('CoordsShortcutActive') || this.localStorage.CoordsShortcutActive;
      this.localStorage.CoordsShortcutPlayers = OE.Storage.get('CoordsShortcutPlayers') || this.localStorage.CoordsShortcutPlayers;
    });
  }
});

Vue.component('options-coordinates', optionsCoordinates);
