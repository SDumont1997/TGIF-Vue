const app = Vue.createApp({
  data() {
    return {
      members: [],
      parties: [],
      state: ""
    };
  },
  created() {
    let chamber = "";
    if (document.URL.includes("senate")) {
      chamber = "senate";
    }
    if (document.URL.includes("house")) {
      chamber = "house";
    }

    let endpoint = `https://api.propublica.org/congress/v1/113/${chamber}/members.json`;
    let init = {
      headers: {
        "X-API-Key": "D2aoW3zGtQgRZhQpjzSuDhoQIDZJammdHlFymlEA",
      },
    };

    fetch(endpoint, init)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        this.members = [...data.results[0].members];
      })
      .catch((error) => {
        console.log(error.message);
      });
  },
  methods: {
    
  },
  computed: {
    filteredMembers(){
      let auxArray = []
      if(this.parties.length === 0 && this.state === ""){
        auxArray = [...this.members]
        return auxArray
      }
      if(this.parties.length !== 0 && this.state === ""){
        auxArray = this.members.filter(member => this.parties.includes(member.party))
        return auxArray
      }
      if(this.parties.length === 0 && this.state !== ""){
        auxArray = this.members.filter(member => member.state === this.state)
        return auxArray
      }
      if(this.parties.length !== 0 && this.state !== ""){
        auxArray = this.members.filter(member => this.parties.includes(member.party) && member.state === this.state)
        return auxArray
      } 
    }
  }
});

let asd = app.mount("#app");
