<template>
  <div>
    <div
      class="table-container"
      v-for="(party, index) in bossPartyTableList"
      :key="index"
      :id="'boss-party-table-' + index"
    >
      <input type="checkbox" class="table-accodian" />
      <div class="table-title">
        <span>{{ getDate(party.date) }}</span>
        <div class="participants-wrapper">
          <div class="participant" v-for="(participant, index) in party.partyMembers" :key="index">
            {{ participant }}
          </div>
        </div>
        <button class="button-close" @click="dropTable(index)">✖️</button>
        <button class="button-download" @click="saveDomAsPng(index, party.date)">⬇️</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>이름</th>
            <th v-for="(boss, index) in party.partyDetails" :key="index">
              {{ boss.bossDifficulty }} {{ boss.bossName }}
            </th>
            <th>합계</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          <tr class="row" v-for="(participant, index) in party.partyMembers" :key="index">
            <td>{{ participant }}</td>
            <td v-for="(boss, index) in party.partyDetails" :key="index">
              <span v-if="boss.participants.includes(participant)">{{
                addComma(boss.perMoney)
              }}</span>
            </td>
            <td>{{ sumPerMoney(participant, party.partyDetails) }}</td>
            <td><input type="checkbox" /></td>
          </tr>
        </tbody>
      </table>

      <div class="party-detail">
        <div class="detail-table-wrapper" v-for="(boss, index) in party.partyDetails" :key="index">
          <div class="detail-table-title">
            <span class="title"
              >{{ boss.bossDifficulty }} {{ boss.bossName }} ({{
                boss.participants.length
              }}인)</span
            >
            <span class="sub-title">총액 {{ addComma(boss.totalMoney) }} G, </span>
            <span class="sub-title">인당 {{ addComma(boss.perMoney) }} G</span>
          </div>
          <table class="detail-table">
            <thead>
              <tr>
                <th>이름</th>
                <th>개당 가격</th>
                <th>수량</th>
                <th>총액</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="(item, index) in boss.dropItemList" :key="index">
                <td>{{ item.label }}</td>
                <td>{{ item.price }}</td>
                <td>{{ item.number }}</td>
                <td>{{ calcPrice(item.price, item.number) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import store from "../stores/store.js";
import * as htmlToImage from "html-to-image";

export default {
  store,
  data() {
    return {
      bossPartyTableList: [],
    };
  },
  methods: {
    getDate(partyDate) {
      const pDateInput = new Date(partyDate);

      const pYear = pDateInput.getFullYear();
      const pMonth = pDateInput.getMonth() + 1;
      const pDate = pDateInput.getDate();

      let pDay = pDateInput.getDay();

      if (pDay === 0) {
        pDay = "일";
      } else if (pDay === 1) {
        pDay = "월";
      } else if (pDay === 2) {
        pDay = "화";
      } else if (pDay === 3) {
        pDay = "수";
      } else if (pDay === 4) {
        pDay = "목";
      } else if (pDay === 5) {
        pDay = "금";
      } else if (pDay === 6) {
        pDay = "토";
      }

      let resultStr = "";

      resultStr =
        pYear.toString().substr(-2) +
        "년 " +
        pMonth.toString() +
        "월 " +
        pDate.toString() +
        "일 (" +
        pDay.toString() +
        ")";

      return resultStr;
    },
    dropTable(tableIndex) {
      store.commit("DROP_BOSS_PARTY", tableIndex);
    },
    addComma(number) {
      return number
        .toString()
        .replace(/(^0+)/, "")
        .replace(/[^0-9]/g, "")
        .replace(/\d(?=(?:\d{3})+$)/g, "$&,");
    },
    sumPerMoney(mem, boss) {
      let sumResult = 0;

      for (const party in boss) {
        if (boss[party].participants.includes(mem)) {
          sumResult += boss[party].perMoney;
        }
      }

      return this.addComma(sumResult);
    },
    calcPrice(money, number) {
      let moneyNumber = Number(money.toString().split(",").join(""));
      const buff = moneyNumber * number;
      return buff
        .toString()
        .replace(/(^0+)/, "")
        .replace(/[^0-9]/g, "")
        .replace(/\d(?=(?:\d{3})+$)/g, "$&,");
    },
    saveDomAsPng(index, partyDate) {
      htmlToImage.toBlob(document.getElementById("boss-party-table-" + index)).then((blob) => {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "dolmengi" + index.toString() + "party" + partyDate.toString() + ".png";
        a.click();
      });
    },
  },
  computed: {
    getTheme() {
      return store.state.theme;
    },
    // getBossPartyTableList() {
    //   return store.state.bossParty;
    // },
  },
  mounted() {
    this.bossPartyTableList = store.state.bossParty;
  },
};
</script>

<style lang="scss" scoped>
@import "../styles/themes.scss";
@import "../styles/_variables.scss";

@each $theme in $themes {
  .#{map-get($theme, "name")} {
    color: map-get($map: $theme, $key: "text");
    div {
      width: 100%;
      .table-container {
        width: 100%;
        box-sizing: border-box;
        margin-bottom: 40px;
        background-color: map-get($map: $theme, $key: "light-color");
        padding: 2rem;
        border-radius: 20px;
        box-shadow: $content-box-shadow;
        position: relative;
        cursor: pointer;

        &:hover {
          box-shadow: $content-box-shadow-hover;
        }

        .table-accodian {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          z-index: 2;
          appearance: none;

          &:checked ~ .party-detail {
            display: block;
            transition: 0.2s;
          }
        }
        .table-title {
          user-select: none;
          display: flex;
          justify-content: space-between;
          position: relative;
          align-items: center;

          span {
            font-weight: bold;
            font-size: 2rem;
            font-family: "MaplestoryOTFBold";
            white-space: nowrap;
          }

          .participants-wrapper {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            width: 100%;
            flex-wrap: wrap;

            .participant {
              margin: 5px 10px 5px 0;
              position: relative;
              box-sizing: border-box;
              background-color: map-get($map: $theme, $key: "dark-color");
              padding: 7px 18px;
              font-size: 0.85rem;
              border-radius: 10px;
              white-space: nowrap;
              width: fit-content;
              height: fit-content;
            }
          }

          button {
            position: absolute;
            right: -6rem;
            border-radius: 20px;
            padding: 0.8rem;
          }

          .button-close {
            top: -2rem;
            background-color: $error-msg;
            border: 3px solid $error-msg;

            &:hover {
              border: 3px solid $error-msg;
              background-color: map-get($map: $theme, $key: "light-color");
              transition: 0.2s;
              scale: 1.1;
            }
          }

          .button-download {
            top: 2rem;
            background-color: $main-color;
            border: 3px solid $main-color;

            &:hover {
              border: 3px solid $main-color;
              background-color: map-get($map: $theme, $key: "light-color");
              transition: 0.2s;
              scale: 1.1;
            }
          }
        }

        table {
          margin: 20px 0;
          background: map-get($map: $theme, $key: "background");
          position: relative;
          font-size: 1.1rem;

          * {
            position: relative;
          }

          td,
          th {
            padding: 10px;
            text-align: center;
            vertical-align: middle;

            &:first-of-type {
              width: 120px;
              font-weight: bold;
            }
            &:nth-last-of-type(2) {
              width: 160px;
            }
            &:last-of-type {
              width: 30px;
              background: map-get($map: $theme, $key: "background");
            }
          }

          thead tr {
            background: map-get($map: $theme, $key: "dark-color");
            font-weight: bold;
            color: map-get($map: $theme, $key: "text");
            th {
              border-right: 1px solid map-get($map: $theme, $key: "background");

              &:first-of-type {
                background: map-get($map: $theme, $key: "light-color");
              }

              &:last-of-type {
                border: none;
                background: map-get($map: $theme, $key: "light-color");
              }
            }
          }

          tbody tr {
            background: map-get($map: $theme, $key: "background");
            color: rgba(map-get($map: $theme, $key: "text"), 0.8);

            &:hover {
              background: rgba($main-color, 0.2);
            }

            &:has(input:checked) {
              background: rgba(map-get($map: $theme, $key: "dark-color"), 0.5);
              color: rgba(map-get($map: $theme, $key: "text"), 0.5);
              font-weight: normal;
              border: none;

              td:first-of-type,
              td:nth-last-of-type(2) {
                color: rgba(map-get($map: $theme, $key: "text"), 0.5);
                font-weight: normal;
              }

              td:before {
                content: " ";
                position: absolute;
                top: 50%;
                left: 0;
                border-bottom: 1px solid rgba(map-get($map: $theme, $key: "text"), 0.5);
                width: 100%;
              }
            }

            td {
              border-right: 1px solid map-get($map: $theme, $key: "dark-color");
              &:hover {
                background: rgba($main-color, 0.2);
              }

              &:first-of-type {
                color: map-get($map: $theme, $key: "text");
              }

              &:nth-last-of-type(2) {
                color: map-get($map: $theme, $key: "text");
                font-weight: bold;
              }

              input[type="checkbox"] {
                position: absolute;
                top: 0;
                left: 0;
                bottom: 0;
                right: 0;
                margin: auto;
                width: 25px;
                height: 25px;
                z-index: 99;
                cursor: pointer;
              }
            }
          }
        }
      }

      .party-detail {
        display: none;

        .detail-table-wrapper {
          background-color: map-get($map: $theme, $key: "background");
          padding: 2rem;
          border-radius: 20px;
          margin-bottom: 20px;
          width: 100%;
          box-sizing: border-box;

          .detail-table-title {
            font-family: "MaplestoryOTFBold";
            white-space: nowrap;
            user-select: none;

            .title {
              font-weight: bold;
              font-size: 1.4rem;
              margin-right: 10px;
            }

            .sub-title {
              color: $main-color;
              margin-right: 10px;
            }
          }

          .detail-table {
            width: 100%;
            box-sizing: border-box;
            background: map-get($map: $theme, $key: "light-color");
            position: relative;

            * {
              position: relative;
            }

            td,
            th {
              font-weight: normal;
              background: map-get($map: $theme, $key: "light-color");

              &:first-of-type {
                width: 250px;
                font-weight: bold;
              }

              &:last-of-type {
                width: 120px;
                font-weight: bold;
              }
            }
            thead tr th {
              background: map-get($map: $theme, $key: "dark-color");
              font-weight: bold;
            }

            tbody tr {
              background: map-get($map: $theme, $key: "light-color");
              td {
                border-right: 1px solid map-get($map: $theme, $key: "background");
              }
            }
          }
        }
      }
    }
  }
}
</style>
