const app = Vue.createApp({
  data() {
    return {
      members: [],
      statistics: {
        republicans: [],
        democrats: [],
        independents: [],
        averageVotesWithPartyRepublicans: 0,
        averageVotesWithPartyDemocrats: 0,
        averageVotesWithPartyIndependents: 0,
        averageVotesWithPartyTotal: 0,
        averageMissedVotesRepublicans: 0,
        averageMissedVotesDemocrats: 0,
        averageMissedVotesIndependents: 0,
        averageMissedVotesTotal: 0,
        sortedMembersByLoyaltyUp: [],
        sortedMembersByLoyaltyDown: [],
        sortedMembersByMissedVotesUp: [],
        sortedMembersByMissedVotesDown: [],
        mostLoyal: [],
        leastLoyal: [],
        mostEngaged: [],
        leastEngaged: [],
      }
    };
  },
  methods: {
    returnRepublicans(){
      return this.members.filter(member => member.party === "R")
    },
    returnDemocrats(){
      return this.members.filter(member => member.party === "D")
    },
    returnIndependents(){
      return this.members.filter(member => member.party === "ID")
    },
    calculatePartyPct(party, criteria) {
      let totalPct = 0;
      party.forEach((member) => {
        totalPct += member[criteria];
      });
      totalPct /= party.length;
      return totalPct;
    },
    getAverageVotesWithPartyRepublicans(){
      return parseFloat(this.calculatePartyPct(this.statistics.republicans, "votes_with_party_pct").toFixed(2))
    },
    getAverageVotesWithPartyDemocrats(){
      return parseFloat(this.calculatePartyPct(this.statistics.democrats, "votes_with_party_pct").toFixed(2))
    },
    getAverageVotesWithPartyIndependents(){
      if(this.statistics.independents.length === 0){
        return "-"
      }
      return parseFloat(this.calculatePartyPct(this.statistics.independents, "votes_with_party_pct").toFixed(2))
    },
    getAverageVotesWithPartyTotal(){
      if(this.statistics.averageVotesWithPartyIndependents === "-"){
        return ((this.statistics.averageVotesWithPartyRepublicans + this.statistics.averageVotesWithPartyDemocrats)/2).toFixed(2)
      }
      return ((this.statistics.averageVotesWithPartyRepublicans + this.statistics.averageVotesWithPartyDemocrats + this.statistics.averageVotesWithPartyIndependents)/3).toFixed(2)
    },
    getAverageMissedVotesRepublicans(){
      return parseFloat(this.calculatePartyPct(this.statistics.republicans, "missed_votes_pct").toFixed(2))
    },
    getAverageMissedVotesDemocrats(){
      return parseFloat(this.calculatePartyPct(this.statistics.democrats, "missed_votes_pct").toFixed(2))
    },
    getAverageMissedVotesIndependents(){
      if(this.statistics.independents.length === 0){
        return "-"
      }
      return parseFloat(this.calculatePartyPct(this.statistics.independents, "missed_votes_pct").toFixed(2))
    },
    getAverageMissedVotesTotal(){
      if(this.statistics.averageMissedVotesIndependents === "-"){
        return ((this.statistics.averageMissedVotesRepublicans + this.statistics.averageMissedVotesDemocrats)/2).toFixed(2)
      }
      return ((this.statistics.averageMissedVotesRepublicans + this.statistics.averageMissedVotesDemocrats + this.statistics.averageMissedVotesIndependents)/3).toFixed(2)
    },
    sortMembersBy(array, criteria, order) {
      let sortedMembers;
      if (order.toLowerCase() === "up") {
        sortedMembers = array.sort(function (memberA, memberB) {
          return memberA[criteria] - memberB[criteria];
        });
      } else if (order.toLowerCase() === "down") {
        sortedMembers = array.sort(function (memberA, memberB) {
          return memberB[criteria] - memberA[criteria];
        });
      } else {
        return "Orden Invalido";
      }
      sortedMembers = sortedMembers.filter(member => {
          if(member.total_votes !== 0){
              return member
          }
      })
      return sortedMembers;
    },
    getSortedMembersByLoyaltyUp(){
      return [...this.sortMembersBy(this.members, "votes_with_party_pct", "up")]
    },
    getSortedMembersByLoyaltyDown(){
      return [...this.sortMembersBy(this.members, "votes_with_party_pct", "down")]
    },
    getSortedMembersByMissedVotesUp(){
      return [...this.sortMembersBy(this.members, "missed_votes_pct", "up")]
    },
    getSortedMembersByMissedVotesDown(){
      return [...this.sortMembersBy(this.members, "missed_votes_pct", "down")]
    },
    getTenPct(sortedArray, criteria) {
      let tenPct = [];
      tenPct.push(...sortedArray.slice(0, Math.ceil(sortedArray.length / 10)));
      while (
        tenPct[tenPct.length - 1][criteria] === sortedArray[tenPct.length][criteria]
      ) {
        tenPct.push(sortedArray[tenPct.length]);
      }
      return tenPct;
    },
    getMostLoyal(){
      return [...this.getTenPct(this.statistics.sortedMembersByLoyaltyDown, "votes_with_party_pct")]
    },
    getLeastLoyal(){
      return [...this.getTenPct(this.statistics.sortedMembersByLoyaltyUp, "votes_with_party_pct")]
    },
    getMostEngaged(){
      return [...this.getTenPct(this.statistics.sortedMembersByMissedVotesUp, "missed_votes_pct")]
    },
    getLeastEngaged(){
      return [...this.getTenPct(this.statistics.sortedMembersByMissedVotesDown, "missed_votes_pct")]
    } 
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
        this.members = [...data.results[0].members]
        this.statistics.republicans = [...this.returnRepublicans()]
        this.statistics.democrats = [...this.returnDemocrats()]
        this.statistics.independents = [...this.returnIndependents()]
        this.statistics.averageVotesWithPartyRepublicans = this.getAverageVotesWithPartyRepublicans()
        this.statistics.averageVotesWithPartyDemocrats = this.getAverageVotesWithPartyDemocrats()
        this.statistics.averageVotesWithPartyIndependents = this.getAverageVotesWithPartyIndependents()
        this.statistics.averageVotesWithPartyTotal = this.getAverageVotesWithPartyTotal()
        this.statistics.averageMissedVotesRepublicans = this.getAverageMissedVotesRepublicans()
        this.statistics.averageMissedVotesDemocrats = this.getAverageMissedVotesDemocrats()
        this.statistics.averageMissedVotesIndependents = this.getAverageMissedVotesIndependents()
        this.statistics.averageMissedVotesTotal = this.getAverageMissedVotesTotal()
        this.statistics.sortedMembersByLoyaltyUp = this.getSortedMembersByLoyaltyUp()
        this.statistics.sortedMembersByLoyaltyDown = this.getSortedMembersByLoyaltyDown()
        this.statistics.sortedMembersByMissedVotesUp = this.getSortedMembersByMissedVotesUp()
        this.statistics.sortedMembersByMissedVotesDown = this.getSortedMembersByMissedVotesDown()
        this.statistics.mostLoyal = [...this.getMostLoyal()]
        this.statistics.leastLoyal = [...this.getLeastLoyal()]
        this.statistics.mostEngaged = [...this.getMostEngaged()]
        this.statistics.leastEngaged = [...this.getLeastEngaged()]
      })
      .catch((error) => {
        console.log(error.message);
      });
  },
});

app.mount("#app");
