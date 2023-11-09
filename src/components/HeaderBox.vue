<template>
  <div class="header-container">
    <header>
      <nav>
        <ul>
          <li></li>
          <li>
            <label
              ><input type="checkbox" @change="onChangeTheme" />
              <div class="icon-box">
                <i class="fa fa-home" aria-hidden="true">{{ themeIcon }}</i>
              </div></label
            >
          </li>
        </ul>
      </nav>
      <input type="button" value="정산하기" @click="onShowModal" />
    </header>

    <dialog>
      <div class="dialog-container">
        <div class="dialog-header-wrapper">
          <div class="dialog-header">
            <div class="dialog-calendar">
              <h2>{{ date.year }}년 {{ date.month }}/{{ date.date }} ({{ date.day }})</h2>
              <input type="date" v-model="date.dateInput" @input="setDate" />
              <h2>보스 정산</h2>
            </div>
            <button @click="onClickCloseModalBtn">취소하기</button>
          </div>
        </div>

        <div class="dialog-contents">
          <boss-drop-table
            v-for="(boss, index) in calcTableList"
            :key="boss"
            :bossName="boss[0]"
            :bossDifficulty="boss[1]"
            :bossDrops="boss[2]"
            :parentIndex="index"
            ref="bossDropTable"
          ></boss-drop-table>
        </div>
        <div class="dialog-footer">
          <div class="dialog-footer-new-table">
            <select v-model="selectedBoss" @change="resetBoss">
              <option value="none" selected disabled hidden>보스</option>
              <option v-for="(boss, index) in bossList" :key="index" :value="index">
                {{ boss.name }}
              </option>
            </select>

            <select v-model="selectedDifficulty">
              <option
                v-for="(dif, index) in bossList[selectedBoss].difficulty"
                :value="dif"
                :key="index"
              >
                {{ dif }}
              </option>
            </select>

            <button @click="onCreateNewTable">추가하기</button>
          </div>
          <button @click="onClickCalcBtn">정산하기</button>
        </div>
      </div>
    </dialog>
  </div>
</template>

<script>
import store from "../stores/store.js";
import BossDropTable from "./BossDropTable.vue";
export default {
  store,
  components: {
    BossDropTable,
  },
  data() {
    return {
      themeIcon: "☀️",
      bossList: [
        { name: "더스크", difficulty: ["노말", "카오스"] },
        { name: "윌", difficulty: ["노말", "하드"] },
        { name: "루시드", difficulty: ["노말", "하드"] },
        { name: "가디언 엔젤 슬라임", difficulty: ["노말", "카오스"] },
        { name: "스우", difficulty: ["노말", "하드"] },
        { name: "데미안", difficulty: ["노말", "하드"] },
        { name: "듄켈", difficulty: ["노말", "하드"] },
        { name: "진 힐라", difficulty: ["노말", "하드"] },
      ],
      bossDropList: [
        {
          name: "더스크",
          difficulty: "노말",
          dropItems: [
            { label: "수상한 에디셔널 큐브", number: 6, price: 0 },
            { label: "반짝이는 빨간 별 물약", number: 1, price: 0 },
            { label: "반짝이는 파란 별 물약", number: 1, price: 0 },
            { label: "소형 경험 축적의 비약", number: 1, price: 0 },
            { label: "추가 경험치 50% 교환권", number: 1, price: 0 },
            { label: "대형 보스 명예의 훈장", number: 1, price: 0 },
            { label: "강력한 환생의 불꽃", number: 1, price: 0 },
            { label: "영원한 환생의 불꽃", number: 1, price: 0 },
            { label: "검은 환생의 불꽃", number: 1, price: 0 },
            { label: "에스텔라 이어링", number: 1, price: 0 },
            { label: "녹옥의 보스 반지 상자 (하급)", number: 1, price: 0 },
          ],
        },
        {
          name: "더스크",
          difficulty: "카오스",
          dropItems: [
            { label: "수상한 에디셔널 큐브", number: 10, price: 0 },
            { label: "반짝이는 빨간 별 물약", number: 1, price: 0 },
            { label: "반짝이는 파란 별 물약", number: 1, price: 0 },
            { label: "소형 경험 축적의 비약", number: 1, price: 0 },
            { label: "추가 경험치 50% 교환권", number: 1, price: 0 },
            { label: "대형 보스 명예의 훈장", number: 1, price: 0 },
            { label: "강력한 환생의 불꽃", number: 1, price: 0 },
            { label: "영원한 환생의 불꽃", number: 1, price: 0 },
            { label: "검은 환생의 불꽃", number: 1, price: 0 },
            { label: "놀라운 긍정의 혼돈 주문서 60%", number: 1, price: 0 },
            { label: "프리미엄 악세서리 스크롤 교환권", number: 1, price: 0 },
            { label: "프리미엄 펫장비 스크롤 교환권", number: 1, price: 0 },
            { label: "매지컬 무기 주문서 교환권", number: 1, price: 0 },
            { label: "태초의 정수", number: 1, price: 0 },
            { label: "아케인셰이드 무기 상자", number: 1, price: 0 },
            { label: "아케인셰이드 방어구 상자", number: 1, price: 0 },
            { label: "에스텔라 이어링", number: 1, price: 0 },
            { label: "거대한 공포", number: 1, price: 0 },
            { label: "혹옥의 보스 반지 상자 (상급)", number: 1, price: 0 },
          ],
        },
        {
          name: "윌",
          difficulty: "노말",
          dropItems: [
            { label: "수상한 에디셔널 큐브", number: 5, price: 0 },
            { label: "반짝이는 빨간 별 물약", number: 1, price: 0 },
            { label: "반짝이는 파란 별 물약", number: 1, price: 0 },
            { label: "소형 경험 축적의 비약", number: 1, price: 0 },
            { label: "추가 경험치 50% 교환권", number: 1, price: 0 },
            { label: "대형 보스 명예의 훈장", number: 1, price: 0 },
            { label: "강력한 환생의 불꽃", number: 1, price: 0 },
            { label: "영원한 환생의 불꽃", number: 1, price: 0 },
            { label: "트와일라이트 마크", number: 1, price: 0 },
            { label: "녹옥의 보스 반지 상자 (하급)", number: 1, price: 0 },
          ],
        },
        {
          name: "윌",
          difficulty: "하드",
          dropItems: [
            { label: "수상한 에디셔널 큐브", number: 9, price: 0 },
            { label: "반짝이는 빨간 별 물약", number: 1, price: 0 },
            { label: "반짝이는 파란 별 물약", number: 1, price: 0 },
            { label: "소형 경험 축적의 비약", number: 1, price: 0 },
            { label: "추가 경험치 50% 교환권", number: 1, price: 0 },
            { label: "대형 보스 명예의 훈장", number: 1, price: 0 },
            { label: "강력한 환생의 불꽃", number: 1, price: 0 },
            { label: "영원한 환생의 불꽃", number: 1, price: 0 },
            { label: "검은 환생의 불꽃", number: 1, price: 0 },
            { label: "놀라운 긍정의 혼돈 주문서 60%", number: 1, price: 0 },
            { label: "악세서리 스크롤 교환권", number: 1, price: 0 },
            { label: "아케인셰이드 무기 상자", number: 1, price: 0 },
            { label: "아케인셰이드 방어구 상자", number: 1, price: 0 },
            { label: "트와일라이트 마크", number: 1, price: 0 },
            { label: "저주받은 마도서 선택 상자", number: 1, price: 0 },
            { label: "혹옥의 보스 반지 상자 (상급)", number: 1, price: 0 },
          ],
        },
        {
          name: "루시드",
          difficulty: "노말",
          dropItems: [
            { label: "수상한 에디셔널 큐브", number: 4, price: 0 },
            { label: "반짝이는 빨간 별 물약", number: 1, price: 0 },
            { label: "반짝이는 파란 별 물약", number: 1, price: 0 },
            { label: "소형 경험 축적의 비약", number: 1, price: 0 },
            { label: "추가 경험치 50% 교환권", number: 1, price: 0 },
            { label: "대형 보스 명예의 훈장", number: 1, price: 0 },
            { label: "강력한 환생의 불꽃", number: 1, price: 0 },
            { label: "영원한 환생의 불꽃", number: 1, price: 0 },
            { label: "트와일라이트 마크", number: 1, price: 0 },
            { label: "녹옥의 보스 반지 상자 (하급)", number: 1, price: 0 },
          ],
        },
        {
          name: "루시드",
          difficulty: "하드",
          dropItems: [
            { label: "수상한 에디셔널 큐브", number: 9, price: 0 },
            { label: "반짝이는 빨간 별 물약", number: 1, price: 0 },
            { label: "반짝이는 파란 별 물약", number: 1, price: 0 },
            { label: "소형 경험 축적의 비약", number: 1, price: 0 },
            { label: "추가 경험치 50% 교환권", number: 1, price: 0 },
            { label: "대형 보스 명예의 훈장", number: 1, price: 0 },
            { label: "강력한 환생의 불꽃", number: 1, price: 0 },
            { label: "영원한 환생의 불꽃", number: 1, price: 0 },
            { label: "검은 환생의 불꽃", number: 1, price: 0 },
            { label: "놀라운 긍정의 혼돈 주문서 60%", number: 1, price: 0 },
            { label: "악세서리 스크롤 교환권", number: 1, price: 0 },
            { label: "아케인셰이드 무기 상자", number: 1, price: 0 },
            { label: "아케인셰이드 방어구 상자", number: 1, price: 0 },
            { label: "트와일라이트 마크", number: 1, price: 0 },
            { label: "몽환의 벨트", number: 1, price: 0 },
            { label: "혹옥의 보스 반지 상자 (상급)", number: 1, price: 0 },
          ],
        },
        {
          name: "가디언 엔젤 슬라임",
          difficulty: "노말",
          dropItems: [
            { label: "수상한 에디셔널 큐브", number: 3, price: 0 },
            { label: "반짝이는 빨간 별 물약", number: 1, price: 0 },
            { label: "반짝이는 파란 별 물약", number: 1, price: 0 },
            { label: "소형 경험 축적의 비약", number: 1, price: 0 },
            { label: "추가 경험치 50% 교환권", number: 1, price: 0 },
            { label: "대형 보스 명예의 훈장", number: 1, price: 0 },
            { label: "강력한 환생의 불꽃", number: 1, price: 0 },
            { label: "영원한 환생의 불꽃", number: 1, price: 0 },
            { label: "가디언 엔젤 링", number: 1, price: 0 },
            { label: "녹옥의 보스 반지 상자 (하급)", number: 1, price: 0 },
          ],
        },
        {
          name: "가디언 엔젤 슬라임",
          difficulty: "카오스",
          dropItems: [
            { label: "수상한 에디셔널 큐브", number: 9, price: 0 },
            { label: "반짝이는 빨간 별 물약", number: 1, price: 0 },
            { label: "반짝이는 파란 별 물약", number: 1, price: 0 },
            { label: "소형 경험 축적의 비약", number: 1, price: 0 },
            { label: "추가 경험치 50% 교환권", number: 1, price: 0 },
            { label: "대형 보스 명예의 훈장", number: 1, price: 0 },
            { label: "강력한 환생의 불꽃", number: 1, price: 0 },
            { label: "영원한 환생의 불꽃", number: 1, price: 0 },
            { label: "검은 환생의 불꽃", number: 1, price: 0 },
            { label: "놀라운 긍정의 혼돈 주문서 60%", number: 1, price: 0 },
            { label: "프리미엄 악세서리 스크롤 교환권", number: 1, price: 0 },
            { label: "매지컬 무기 주문서 교환권", number: 1, price: 0 },
            { label: "태초의 정수", number: 1, price: 0 },
            { label: "가디언 엔젤 링", number: 1, price: 0 },
            { label: "혹옥의 보스 반지 상자 (상급)", number: 1, price: 0 },
          ],
        },
        {
          name: "스우",
          difficulty: "노말",
          dropItems: [
            { label: "수상한 에디셔널 큐브", number: 3, price: 0 },
            { label: "반짝이는 빨간 별 물약", number: 1, price: 0 },
            { label: "반짝이는 파란 별 물약", number: 1, price: 0 },
            { label: "소형 경험 축적의 비약", number: 1, price: 0 },
            { label: "추가 경험치 50% 교환권", number: 1, price: 0 },
            { label: "대형 보스 명예의 훈장", number: 1, price: 0 },
            { label: "강력한 환생의 불꽃", number: 1, price: 0 },
            { label: "녹옥의 보스 반지 상자 (하급)", number: 1, price: 0 },
          ],
        },
        {
          name: "스우",
          difficulty: "하드",
          dropItems: [
            { label: "수상한 에디셔널 큐브", number: 8, price: 0 },
            { label: "반짝이는 빨간 별 물약", number: 1, price: 0 },
            { label: "반짝이는 파란 별 물약", number: 1, price: 0 },
            { label: "소형 경험 축적의 비약", number: 1, price: 0 },
            { label: "추가 경험치 50% 교환권", number: 1, price: 0 },
            { label: "대형 보스 명예의 훈장", number: 1, price: 0 },
            { label: "강력한 환생의 불꽃", number: 1, price: 0 },
            { label: "영원한 환생의 불꽃", number: 1, price: 0 },
            { label: "검은 환생의 불꽃", number: 1, price: 0 },
            { label: "놀라운 긍정의 혼돈 주문서 60%", number: 1, price: 0 },
            { label: "악세서리 스크롤 교환권", number: 1, price: 0 },
            { label: "앱솔랩스 무기 상자", number: 1, price: 0 },
            { label: "앱솔랩스 방어구 상자", number: 1, price: 0 },
            { label: "루즈 컨트롤 머신 마크", number: 1, price: 0 },
            { label: "블랙 하트", number: 1, price: 0 },
            { label: "혹옥의 보스 반지 상자 (상급)", number: 1, price: 0 },
          ],
        },
        {
          name: "데미안",
          difficulty: "노말",
          dropItems: [
            { label: "수상한 에디셔널 큐브", number: 3, price: 0 },
            { label: "반짝이는 빨간 별 물약", number: 1, price: 0 },
            { label: "반짝이는 파란 별 물약", number: 1, price: 0 },
            { label: "소형 경험 축적의 비약", number: 1, price: 0 },
            { label: "추가 경험치 50% 교환권", number: 1, price: 0 },
            { label: "대형 보스 명예의 훈장", number: 1, price: 0 },
            { label: "강력한 환생의 불꽃", number: 1, price: 0 },
            { label: "루인 포스 실드", number: 1, price: 0 },
            { label: "녹옥의 보스 반지 상자 (하급)", number: 1, price: 0 },
          ],
        },
        {
          name: "데미안",
          difficulty: "하드",
          dropItems: [
            { label: "수상한 에디셔널 큐브", number: 7, price: 0 },
            { label: "반짝이는 빨간 별 물약", number: 1, price: 0 },
            { label: "반짝이는 파란 별 물약", number: 1, price: 0 },
            { label: "소형 경험 축적의 비약", number: 1, price: 0 },
            { label: "추가 경험치 50% 교환권", number: 1, price: 0 },
            { label: "대형 보스 명예의 훈장", number: 1, price: 0 },
            { label: "강력한 환생의 불꽃", number: 1, price: 0 },
            { label: "영원한 환생의 불꽃", number: 1, price: 0 },
            { label: "검은 환생의 불꽃", number: 1, price: 0 },
            { label: "놀라운 긍정의 혼돈 주문서 60%", number: 1, price: 0 },
            { label: "악세서리 스크롤 교환권", number: 1, price: 0 },
            { label: "앱솔랩스 무기 상자", number: 1, price: 0 },
            { label: "앱솔랩스 방어구 상자", number: 1, price: 0 },
            { label: "루인 포스 실드", number: 1, price: 0 },
            { label: "마력이 깃든 안대", number: 1, price: 0 },
            { label: "혹옥의 보스 반지 상자 (상급)", number: 1, price: 0 },
          ],
        },
        {
          name: "듄켈",
          difficulty: "노말",
          dropItems: [
            { label: "수상한 에디셔널 큐브", number: 6, price: 0 },
            { label: "반짝이는 빨간 별 물약", number: 1, price: 0 },
            { label: "반짝이는 파란 별 물약", number: 1, price: 0 },
            { label: "소형 경험 축적의 비약", number: 1, price: 0 },
            { label: "추가 경험치 50% 교환권", number: 1, price: 0 },
            { label: "대형 보스 명예의 훈장", number: 1, price: 0 },
            { label: "강력한 환생의 불꽃", number: 1, price: 0 },
            { label: "영원한 환생의 불꽃", number: 1, price: 0 },
            { label: "검은 환생의 불꽃", number: 1, price: 0 },
            { label: "에스텔라 이어링", number: 1, price: 0 },
            { label: "녹옥의 보스 반지 상자 (하급)", number: 1, price: 0 },
          ],
        },
        {
          name: "듄켈",
          difficulty: "하드",
          dropItems: [
            { label: "수상한 에디셔널 큐브", number: 10, price: 0 },
            { label: "반짝이는 빨간 별 물약", number: 1, price: 0 },
            { label: "반짝이는 파란 별 물약", number: 1, price: 0 },
            { label: "소형 경험 축적의 비약", number: 1, price: 0 },
            { label: "추가 경험치 50% 교환권", number: 1, price: 0 },
            { label: "대형 보스 명예의 훈장", number: 1, price: 0 },
            { label: "강력한 환생의 불꽃", number: 1, price: 0 },
            { label: "영원한 환생의 불꽃", number: 1, price: 0 },
            { label: "검은 환생의 불꽃", number: 1, price: 0 },
            { label: "놀라운 긍정의 혼돈 주문서 60%", number: 1, price: 0 },
            { label: "프리미엄 악세서리 스크롤 교환권", number: 1, price: 0 },
            { label: "프리미엄 펫장비 스크롤 교환권", number: 1, price: 0 },
            { label: "매지컬 무기 주문서 교환권", number: 1, price: 0 },
            { label: "태초의 정수", number: 1, price: 0 },
            { label: "아케인셰이드 무기 상자", number: 1, price: 0 },
            { label: "아케인셰이드 방어구 상자", number: 1, price: 0 },
            { label: "에스텔라 이어링", number: 1, price: 0 },
            { label: "커맨드 포스 이어링", number: 1, price: 0 },
            { label: "혹옥의 보스 반지 상자 (상급)", number: 1, price: 0 },
          ],
        },
        {
          name: "진 힐라",
          difficulty: "노말",
          dropItems: [
            { label: "수상한 에디셔널 큐브", number: 9, price: 0 },
            { label: "반짝이는 빨간 별 물약", number: 1, price: 0 },
            { label: "반짝이는 파란 별 물약", number: 1, price: 0 },
            { label: "소형 경험 축적의 비약", number: 1, price: 0 },
            { label: "추가 경험치 50% 교환권", number: 1, price: 0 },
            { label: "대형 보스 명예의 훈장", number: 1, price: 0 },
            { label: "강력한 환생의 불꽃", number: 1, price: 0 },
            { label: "영원한 환생의 불꽃", number: 1, price: 0 },
            { label: "검은 환생의 불꽃", number: 1, price: 0 },
            { label: "놀라운 긍정의 혼돈 주문서 60%", number: 1, price: 0 },
            { label: "악세서리 스크롤 교환권", number: 1, price: 0 },
            { label: "아케인셰이드 무기 상자", number: 1, price: 0 },
            { label: "아케인셰이드 방어구 상자", number: 1, price: 0 },
            { label: "데이브레이크 펜던트", number: 1, price: 0 },
            { label: "홍옥의 보스 반지 상자 (중급)", number: 1, price: 0 },
          ],
        },
        {
          name: "진 힐라",
          difficulty: "하드",
          dropItems: [
            { label: "수상한 에디셔널 큐브", number: 10, price: 0 },
            { label: "반짝이는 빨간 별 물약", number: 1, price: 0 },
            { label: "반짝이는 파란 별 물약", number: 1, price: 0 },
            { label: "소형 경험 축적의 비약", number: 1, price: 0 },
            { label: "추가 경험치 50% 교환권", number: 1, price: 0 },
            { label: "대형 보스 명예의 훈장", number: 1, price: 0 },
            { label: "강력한 환생의 불꽃", number: 1, price: 0 },
            { label: "영원한 환생의 불꽃", number: 1, price: 0 },
            { label: "검은 환생의 불꽃", number: 1, price: 0 },
            { label: "놀라운 긍정의 혼돈 주문서 60%", number: 1, price: 0 },
            { label: "프리미엄 악세서리 스크롤 교환권", number: 1, price: 0 },
            { label: "프리미엄 펫장비 스크롤 교환권", number: 1, price: 0 },
            { label: "매지컬 무기 주문서 교환권", number: 1, price: 0 },
            { label: "태초의 정수", number: 1, price: 0 },
            { label: "아케인셰이드 무기 상자", number: 1, price: 0 },
            { label: "아케인셰이드 방어구 상자", number: 1, price: 0 },
            { label: "데이브레이크 펜던트", number: 1, price: 0 },
            { label: "고통의 근원", number: 1, price: 0 },
            { label: "혹옥의 보스 반지 상자 (상급)", number: 1, price: 0 },
          ],
        },
      ], // 보스 전체 드랍템
      date: {
        dateInput: "",
        year: 0,
        month: 0,
        date: 0,
        day: "일",
      },
      selectedBoss: 0,
      selectedDifficulty: "노말",
      calcTableList: [],
      totalAmounts: [],
    };
  },
  methods: {
    onChangeTheme() {
      store.commit("CHANGETHEME");
      this.onChangeThemeBtn();
    },
    onChangeThemeBtn() {
      if (store.state.theme == "theme-light") {
        this.themeIcon = "☀️";
      } else if (store.state.theme == "theme-dark") {
        this.themeIcon = "🌙";
      }
    },
    onShowModal() {
      const myDialog = document.querySelector("dialog");
      myDialog.showModal();
    },
    onClickCloseModalBtn() {
      this.askBeforeClose();
    },
    askBeforeClose() {
      if (this.calcTableList.length > 0) {
        event.preventDefault();
        if (
          window.confirm("작성을 취소하고 창을 닫으시겠습니까? (작성한 내용이 전부 사라집니다)")
        ) {
          this.onCloseModal();
        }
      } else {
        this.onCloseModal();
      }
    },
    onCloseModal() {
      this.getToday();
      this.selectedBoss = 0;
      this.selectedDifficulty = "노말";
      this.calcTableList = [];
      this.totalAmounts = [];

      const myDialog = document.querySelector("dialog");
      myDialog.close();
    },
    onCreateNewTable() {
      const bossName = this.bossList[this.selectedBoss].name;
      const bossDifficulty = this.selectedDifficulty;
      let bossDrops = [];

      for (let boss in this.bossDropList) {
        if (
          this.bossDropList[boss].name === bossName &&
          this.bossDropList[boss].difficulty === bossDifficulty
        ) {
          bossDrops = this.bossDropList[boss].dropItems;
        }
      }

      this.calcTableList.push([bossName, bossDifficulty, bossDrops]);
    },
    resetBoss() {
      this.selectedDifficulty = "노말";
    },
    dropTable(index) {
      this.calcTableList.splice(index, 1);
    },
    onClickCalcBtn() {
      this.totalAmounts = [];
      const bossDropTables = this.$refs.bossDropTable;
      for (let bossDropTable in bossDropTables) {
        this.totalAmounts.push(bossDropTables[bossDropTable].passTableForm());
      }

      this.setPayload();

      // this.onCloseModal();
    },
    getToday() {
      let today = new Date();

      this.date.year = today.getFullYear();
      this.date.month = today.getMonth() + 1;
      this.date.date = today.getDate();

      let dayInput = today.getDay();
      if (dayInput === 0) {
        this.date.day = "일";
      } else if (dayInput === 1) {
        this.date.day = "월";
      } else if (dayInput === 2) {
        this.date.day = "화";
      } else if (dayInput === 3) {
        this.date.day = "수";
      } else if (dayInput === 4) {
        this.date.day = "목";
      } else if (dayInput === 5) {
        this.date.day = "금";
      } else if (dayInput === 6) {
        this.date.day = "토";
      }

      let dateBuff = "";

      if (this.date.date < 10) {
        dateBuff = "0" + this.date.date.toString();
      } else {
        dateBuff = this.date.date.toString();
      }

      this.date.dateInput =
        this.date.year.toString() + "-" + this.date.month.toString() + "-" + dateBuff;
    },
    setDate(e) {
      let today = new Date(e.target.value);

      this.date.year = today.getFullYear();
      this.date.month = today.getMonth() + 1;
      this.date.date = today.getDate();

      let dayInput = today.getDay();
      if (dayInput === 0) {
        this.date.day = "일";
      } else if (dayInput === 1) {
        this.date.day = "월";
      } else if (dayInput === 2) {
        this.date.day = "화";
      } else if (dayInput === 3) {
        this.date.day = "수";
      } else if (dayInput === 4) {
        this.date.day = "목";
      } else if (dayInput === 5) {
        this.date.day = "금";
      } else if (dayInput === 6) {
        this.date.day = "토";
      }
    },
    setPayload() {
      let partyMembers = [];
      const partyDetail = this.totalAmounts;

      for (const i in partyDetail) {
        partyMembers = partyMembers.concat(partyDetail[i].participants);
        partyMembers = [...new Set(partyMembers)];
      }

      const storePayloadObj = {
        date: this.date.dateInput,
        partyMembers: partyMembers,
        partyDetails: partyDetail,
      };

      if (partyDetail.length > 0) {
        store.commit("WRITE_NEW_BOSS_PARTY", storePayloadObj);
      }
      this.onCloseModal();
    },
  },
  computed: {
    getTheme() {
      return store.state.theme;
    },
  },
  mounted() {
    this.getToday();
    this.onChangeThemeBtn();
  },
};
</script>

<style lang="scss" scoped>
@import "../styles/themes.scss";
@import "../styles/_variables.scss";

@each $theme in $themes {
  .#{map-get($theme, "name")} {
    color: map-get($map: $theme, $key: "text");
    width: 100%;

    .header-container {
      position: relative;
      top: 0;
      left: 0;
      width: 100%;
      box-shadow: $content-box-shadow;
      padding: 10px 0;
      background-color: map-get($map: $theme, $key: "background");
      font-size: 1.2rem;
      margin-bottom: 50px;

      header {
        width: 100%;
        max-width: $max-width;
        margin: 0 auto;
        position: relative;
        display: flex;
        justify-content: space-between;

        nav {
          margin: auto 0 auto 10px;

          ul {
            list-style: none;

            li {
              label {
                position: relative;
                cursor: pointer;

                & input[type="checkbox"] {
                  position: absolute;
                  opacity: 0;
                }

                & :checked ~ .icon-box {
                  box-shadow: $btn-shadow;

                  & .fa {
                    transform: scale(0.95);
                  }
                }

                & :hover ~ .icon-box {
                  transform: scale(1.05);
                  transition: 0.2s;
                }

                & .icon-box {
                  padding: 10px;
                  background: map-get($map: $theme, $key: "light-color");
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  box-shadow: $btn-shadow;
                  border-radius: 10px;
                }
              }
            }
          }
        }

        input {
          margin: auto 10px auto 0;
          padding: 15px 30px;
          border: 2px solid transparent;
          background-color: $main-color;
          color: $black;
          font-size: 1rem;

          &:hover {
            border: 2px solid $main-color;
            background-color: map-get($map: $theme, $key: "light-color");
            color: $main-color;
            transition: 0.2s;
          }
        }
      }

      dialog {
        position: fixed;
        width: 100%;
        height: 100%;
        max-width: 1080px;
        max-height: 90%;
        background-color: map-get($map: $theme, $key: "light-color");
        color: map-get($map: $theme, $key: "text");
        border: none;
        border-radius: 30px;
        outline: none;
        box-shadow: $content-box-shadow;

        &::backdrop {
          background: rgba(map-get($map: $theme, $key: "text"), 0.1);
          backdrop-filter: blur(2px);
          transition: 0.2s;
        }

        .dialog-container {
          width: 100%;
          height: 100%;
          position: relative;
          display: flex;
          flex-direction: column;

          .dialog-header-wrapper {
            display: flex;
            flex-direction: column;

            .dialog-header {
              display: flex;
              justify-content: space-between;

              .dialog-calendar {
                position: relative;
                user-select: none;
                width: 100%;
                display: flex;

                h2 {
                  font-weight: bold;
                  font-size: 1.2rem;
                  position: relative;
                  padding: 0.8rem;
                }

                input[type="date"] {
                  border: none;
                  position: relative;
                  padding: 0;
                  width: 40px;
                  height: 40px;
                  margin: auto 0;
                  color: transparent;
                  background: transparent;
                  user-select: none !important;
                  overflow: visible;

                  &::-webkit-calendar-picker-indicator {
                    cursor: pointer;
                    position: absolute;
                    padding: 0.8rem;
                    background-color: map-get($map: $theme, $key: "dark-color");
                    border-radius: 20px;
                    display: block !important;
                    width: 100%;
                    height: 100%;
                    box-sizing: border-box;
                    text-align: center;

                    &:hover {
                      background-color: $main-color;
                      transition: 0.2s;
                    }
                  }

                  &::before {
                    display: none;
                  }

                  &:valid::before {
                    display: none;
                  }
                }
              }

              button {
                width: 100px;
                background-color: map-get($map: $theme, $key: "dark-color");
                color: map-get($map: $theme, $key: "text");

                &:hover {
                  background-color: $error-msg;
                  color: $black;
                  transition: 0.2s;
                }
              }
            }
          }

          .dialog-contents {
            width: 100%;
            height: 100%;
            margin: 1rem auto;
            overflow: overlay;
          }

          .dialog-footer {
            display: flex;
            flex-direction: column;
            width: 100%;
            max-width: 60%;
            margin: 0 auto;
            .dialog-footer-new-table {
              display: flex;

              select {
                background: map-get($map: $theme, $key: "background");
                color: map-get($map: $theme, $key: "text");
                font-size: 1.2rem;
                margin-right: 1rem;
              }

              button {
                border: 2px solid $main-color;
                margin: auto;
                &:hover {
                  border: 2px solid $main-color;
                  background-color: map-get($map: $theme, $key: "light-color");
                  color: $main-color;
                  transition: 0.2s;
                }
              }
            }

            button {
              border: 2px solid $main-color;
              margin-top: 20px;
              &:hover {
                border: 2px solid $main-color;
                background-color: map-get($map: $theme, $key: "light-color");
                color: $main-color;
                transition: 0.2s;
              }
            }
          }
        }
      }
    }
  }
}
</style>
