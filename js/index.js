////預設值////
let itemPerPage = 6; //預設每頁列出幾筆
let pageNum_base = 5; //一次顯示幾頁的分頁鈕
////
const BASE_URL = "https://lighthouse-user-api.herokuapp.com/api/v1/users/";
const dataPanel = document.querySelector("#data-panel");
const dataFilter = document.querySelector(".dataFilter");
const form = document.querySelector("form");
const searchInput = document.querySelector(".searchInput");
const pagination = document.querySelector(".pagination");
const advended = document.querySelector(".advended");
//加入"我的最愛"的清單
const addList = JSON.parse(localStorage.getItem("friends")) || [];
const emptyArr = []; //用來清空資料用的
let pageStage = 1; //心icon, 預設1是空心, 0是心碎
let gender = ""; //男女符號
let allFriend; //所有清單
let finalList; //統一用於render的清單容器
////個人資訊////
const modalImg = document.querySelector(".modalImg");
const modalName = document.querySelector(".modalName");
const modalGender = document.querySelector(".modalGender");
const modalAge = document.querySelector(".modalAge");
const modalBirthday = document.querySelector(".modalBirthday");
const modalRegion = document.querySelector(".modalRegion");
const modalEmail = document.querySelector(".modalEmail");
const modalAdd = document.querySelector(".modal-add");
const modalContent = document.querySelector(".modal-content");
////進階搜尋欄位////
const female = document.querySelector("#female");
const male = document.querySelector("#male");
const star12 = document.querySelector("#star12");
const ageStart = document.querySelector("#ageStart");
const ageEnd = document.querySelector("#ageEnd");
const advOk = document.querySelector("#advOk");
let advData_gender; //性別資料
let advData_star; //星座資料
let advData_age; //年齡資料
const sartArr = [
	"牡羊座",
	"金牛座",
	"雙子座",
	"巨蟹座",
	"獅子座",
	"處女座",
	"天秤座",
	"天蠍座",
	"射手座",
	"摩羯座",
	"水瓶座",
	"雙魚座",
];
/*
牡羊座：3/21-4/19
金牛座：4/20-5/20
雙子座：5/21-6/21
巨蟹座：6/22-7/22
獅子座：7/23-8/22
處女座：8/23-9/22
天秤座：9/23-10/23
天蠍座：10/24-11/22
射手座：11/23-12/21
摩羯座：12/22-1/19
水瓶座：1/20-2/18
雙魚座：2/19-3/20
*/
//每一頁有幾筆,共有幾頁而產生對應數量的分頁鈕
let str = "";
//存入共有幾頁(幾個數字分頁鈕)的計算結果
let pagitem;
////分頁鈕////
const str_li =
	'<li class="page-item"><a class="page-link pageNo" href="#" data-page="';
const str_prev = '<a class="page-link" href="#">&laquo;</a>'; //上一頁鈕
const str_next = '<a class="page-link" href="#">&raquo;</a>'; //下一頁鈕
let overPage = pageNum_base;
let lowerPage = pageNum_base;
let firstLiNum; //分頁鈕第一顆
let lastLiNum; //分頁鈕最後一顆
// 抓api資料再由renderData()組裝頁面
axios
	.get(BASE_URL)
	.then((res) => {
		// console.log(res);
		//原始資料
		allFriend = res.data.results;
		//存入render專用清單
		finalList = allFriend;
		renderData(finalList);
		paginav(finalList);
		//指定預設要觸發按下分頁鈕所使用的陣列資料為allFriend;
		// filterObj = "allFriend";
		// console.log("filterObj=", filterObj);
	})
	.catch((res) => {
		console.log("errorrr");
	});
//監聽dataPanel按下meet發生showModal()
dataPanel.addEventListener("click", showModal);
//監聽篩選條件按鈕
dataFilter.addEventListener("change", filterRadio);
//監聽搜尋
// form.addEventListener("click", search);
searchInput.addEventListener("input", searching);
//監聽pagiLink按分頁鈕重新讀入資料
pagination.addEventListener("click", pagiLink);
//監聽modal視窗按下加入我的最愛
modalAdd.addEventListener("click", addFav);
//監聽進階搜尋表單
advended.addEventListener("click", advendedSearch);
//監聽星座下拉選單
star12.addEventListener("change", star);

////函式們////
//進階搜尋表單
function advendedSearch(e) {
	// console.log(e);
	const e_mx = e.target.matches("#mx");
	const e_female = e.target.matches("#female");
	const e_male = e.target.matches("#male");
	const e_star12 = e.target.matches("#star12");
	const e_ageStart = e.target.matches("#ageStart");
	const e_ageEnd = e.target.matches(".ageEnd");
	const e_advOk = e.target.matches("#advOk");
	if (e_mx) {
		advData_gender = allFriend;
		// console.log("mx", advData_gender);
	} else if (e_female) {
		// console.log("female");
		advData_gender = allFriend.filter((item) => item.gender == "female");
		// finalList = advData_gender;
		// for (i of advData_gender) {
		// 	console.log(i.birthday);
		// }
		// console.log("female", advData_gender);
		// console.log(advData_gender);
		// console.log(finalList);
	} else if (e_male) {
		// console.log("male");
		advData_gender = allFriend.filter((item) => item.gender == "male");
		// console.log("male", advData_gender);
		// finalList = advData_gender;
		// console.log(advData_gender);
	} else if (e_advOk) {
		//判斷年齡區間不可單填一格, 要就全填, 要就全不填
		if (!ageStart.value) {
			if (ageEnd.value) {
				alert("請完整輸入起始年齡");
				return;
			}
		} else if (!ageEnd.value) {
			if (ageStart.value) {
				alert("請完整輸入起始年齡");
				return;
			}
		}
		/*
		判斷性別、星座、年齡的排列組合
		only性別
		only星座
		only年齡
		性別&&星座
		性別&&年齡
		星座&&年齡
		性別&&星座&&年齡
		*/
		if (mx.checked || female.checked || male.checked) {
			//only性別
			finalList = advData_gender;
			if (star12.value != "不限") {
				//性別&&星座
				finalList = advData_gender.filter((item) => {
					return advData_star.indexOf(item) != -1;
				});
				if (ageStart.value && ageEnd.value) {
					//性別&&星座&&年齡
					ageInput();
					finalList = finalList.filter((item) => {
						return advData_age.indexOf(item) != -1;
					});
					if (finalList == "") {
						alert("沒有條件符合的人，你註定要單身啦");
					}
				}
			} else if (ageStart.value && ageEnd.value) {
				//性別&&年齡
				ageInput();
				finalList = advData_gender.filter((item) => {
					return advData_age.indexOf(item) != -1;
				});
			}
		} else if (star12.value != "不限") {
			//only星座
			finalList = advData_star;
			if (ageStart.value && ageEnd.value) {
				//星座&&年齡
				ageInput();
				finalList = finalList.filter((item) => {
					return advData_age.indexOf(item) != -1;
				});
			}
		} else if (ageStart.value && ageEnd.value) {
			//only年齡
			ageInput();
			finalList = advData_age;
			if (finalList == "") {
				alert("沒有條件符合的人，你註定要單身啦");
			}
		} else if (finalList == "") {
			alert("請設定配對條件");
		}
		console.log("搜尋筆數", finalList.length);

		renderData(finalList);
		paginav(finalList);
	}
}
//清空搜尋表單
function clearAdvForm() {
	female.checked = false;
	male.checked = false;
	star12.value = "不限";
	ageStart.value = "";
	ageEnd.value = "";
}
//從所有名單中過濾出年齡區間存入advData_age
function ageInput() {
	// console.log(ageStart.value);
	// console.log(ageEnd.value);
	advData_age = allFriend.filter((item) => {
		return item.age >= ageStart.value && item.age <= ageEnd.value;
	});
	// console.log("ageInput()的advData_age", advData_age);
	// console.log("aaaaa");
}
//從所有名單中過濾出星座區間存入advData_star
function starDate(m1, d1, m2, d2) {
	advData_star = allFriend.filter((item) => {
		// console.log("aaaa");
		let month = item.birthday.substr(5, 2);
		let day = item.birthday.substr(8, 2);
		return (month == m1 && day >= d1) || (month == m2 && day <= d2);
	});
}
//下拉選單選到哪個星座, 就過濾出該星座的區間
function star(e) {
	// console.log(allFriend);
	// console.log(e.target.value);
	if (e.target.value == "牡羊座") {
		starDate(3, 21, 4, 19);
	} else if (e.target.value == "金牛座") {
		starDate(4, 20, 5, 20);
	} else if (e.target.value == "雙子座") {
		starDate(5, 21, 6, 21);
	} else if (e.target.value == "巨蟹座") {
		starDate(6, 22, 7, 22);
	} else if (e.target.value == "獅子座") {
		starDate(7, 23, 8, 22);
	} else if (e.target.value == "處女座") {
		starDate(8, 23, 9, 22);
	} else if (e.target.value == "天秤座") {
		starDate(9, 23, 10, 23);
	} else if (e.target.value == "天蠍座") {
		starDate(10, 24, 11, 22);
	} else if (e.target.value == "射手座") {
		starDate(11, 23, 12, 21);
	} else if (e.target.value == "摩羯座") {
		starDate(12, 22, 1, 19);
	} else if (e.target.value == "水瓶座") {
		starDate(1, 20, 2, 18);
	} else if (e.target.value == "雙魚座") {
		starDate(2, 19, 3, 20);
	}

	// console.log("advSearchResult", advSearchResult);
}
//modal視窗按下加入我的最愛
function addFav(e) {
	// console.log(allFriend);
	// console.log("id=", e.target.parentElement.parentElement.dataset.modal);
	let id = e.target.parentElement.parentElement.dataset.modal;
	addLike(id);
	//modal區塊當下的modal-content的data-modal;
	let cardBody = document.querySelectorAll(".card-body");
	// console.log(cardBody[2].children[2]);
	//找到對應的個資的<i>把空心改成實心
	cardBody.forEach((items) => {
		// console.log(items.dataset.set);
		if (items.dataset.set == id) {
			// console.log(items.children[2]);
			items.children[2].classList.remove("far");
			items.children[2].classList.add("fas");
		}
	});
}
//加入我的最愛主程式
function addLike(idNum) {
	let newItem = allFriend.find((item) => item.id == idNum);
	if (addList.some((item) => item.id == idNum)) {
		alert("到底想加幾次啦，已在名單中");
		return;
	}
	addList.unshift(newItem);
	localStorage.setItem("friends", JSON.stringify(addList));
}
//keyin即時搜尋
function searching(e) {
	// console.log(e.target);
	pageStage = 1;
	// console.log("btn");
	let value = searchInput.value.trim().toLowerCase();
	// console.log(value);
	// filterObj = "searchResult";
	finalList = allFriend.filter((item) => {
		return (
			item.name.toLowerCase().includes(value) ||
			item.surname.toLowerCase().includes(value)
		);
	});
	paginav(finalList);
	renderData(finalList);
}
//pagiLink按分頁鈕重新讀入資料
function pagiLink(e) {
	// console.log(e.target);
	if (e.target.nodeName != "A") {
		return;
	}
	// 1=0-5
	// 2=6-11
	// 3=12-17
	// console.log(e.target.className);
	// console.log(e.target.matches('.prev'));
	e.preventDefault();
	let idNum = Number(e.target.dataset.page);
	let start = itemPerPage * (idNum - 1);
	let end = itemPerPage * idNum - 1;
	// console.log("advSearchResult是", advSearchResult);
	let dataPerPage = finalList.slice(start, end + 1);
	pagitem = Math.ceil(finalList.length / itemPerPage);
	renderData(dataPerPage);
	console.log(e.currentTarget.children[0]);
	console.log(e.target.parentElement);
	// e.currentTarget.children.classList.add("active");
	// e.currentTarget.children.classList.remove("active");
	for (item of e.currentTarget.children) {
		item.classList.remove("active");
	}
	e.target.parentElement.classList.add("active");
	/////上段為點擊按鈕重新讀取資料////
	/////下段為點擊上一頁、下一頁機制////
	// console.log(e.target);

	let pageNo = document.querySelectorAll(".pageNo");
	if (e.target.parentElement.matches(".prev")) {
		//初始化lowerPage
		// lowerPage = pageNum_base;
		pagination.innerHTML = "";
		str = "";

		firstLiNum = Number(pageNo[0].innerText);
		lastLiNum = Number(pageNo[pageNo.length - 1].innerText);
		//按下即表示扣掉"一次顯示幾頁的分頁鈕"而讓按鈕編號往前
		lowerPage = lastLiNum - pageNum_base;
		//要一起扣掉, 否則不管prev了多少, 它都會停在原來的數值, 一旦按低數字鈕next卻是過大的overPage
		// overPage = lastLiNum - pageNum_base;
		console.log("第一個數字跳鈕的編號", firstLiNum);
		console.log("最後一個數字跳鈕的編號", lastLiNum);
		// console.log("往前的lowerPage", lowerPage, "往前的lastLiNum", lastLiNum);
		console.log("lowerPage", lowerPage, "有低於", pageNum_base, "嗎");
		// console.log("此刻的overPage", overPage);
		//lowerPage小於pageNum_base表示要回到第一頁, 就列出第一組分頁鈕
		if (lowerPage <= pageNum_base) {
			console.log("有低於");
			for (let i = 1; i < pageNum_base + 1; i++) {
				str += `
		${str_li}${i}">${i}</a></li>
		`;
			}
			pagination.innerHTML = `<li class="page-item prev disabled">${str_prev}</li>${str}<li class="page-item next">${str_next}</li>`;
			pagiList = finalList.slice(0, itemPerPage);
			renderData(pagiList);
		} else {
			for (let i = 0; i < pageNum_base; i++) {
				str += `
		${str_li}${firstLiNum - pageNum_base + i}">${
					firstLiNum - pageNum_base + i
				}</a></li>
		`;
			}
			pagination.innerHTML = `<li class="page-item prev">${str_prev}</li>${str}<li class="page-item next">${str_next}</li>`;

			start = (firstLiNum - pageNum_base) * itemPerPage - itemPerPage;
			end = (lastLiNum - pageNum_base) * itemPerPage;
			pagiList = finalList.slice(start, end);
			renderData(pagiList);
		}
	}
	if (e.target.parentElement.matches(".next")) {
		//初始化overPage
		// overPage = pageNum_base;
		pagination.innerHTML = "";
		str = "";

		lastLiNum = Number(pageNo[pageNo.length - 1].innerText);
		overPage = lastLiNum + 1;
		overPage += pageNum_base;
		// console.log(li[1]);
		// li[1].classList.add("active");
		// console.log("最後一個數字跳鈕的編號", lastLiNum);
		// console.log("往後的lowerPage", lowerPage, "往後的lastLiNum", lastLiNum);
		// console.log("往後的lastLiNum", lastLiNum);
		//overPage為按下之前最後一個li的編號, 也就會變成新一組li的第一個li的編號
		// console.log("此刻的lastLiNum", lastLiNum);

		// console.log("overPage", overPage, "有超過", pagitem, "嗎");
		// console.log("此刻的lowerPage", lowerPage);

		if (overPage > pagitem) {
			// console.log("已超過");
			// console.log("超過時當下的overPage", overPage);
			// console.log("超過時當下的lowerPage", lowerPage);
			for (let i = 1; i < pageNum_base + 1; i++) {
				str += `
		${str_li}${pagitem - pageNum_base + i}">${pagitem - pageNum_base + i}</a></li>
		`;
			}
			pagination.innerHTML = `<li class="page-item prev">${str_prev}</li>${str}<li class="page-item next disabled">${str_next}</li>`;
			start = (pagitem - pageNum_base + 1) * itemPerPage - itemPerPage;
			end = (pagitem - pageNum_base + 1) * itemPerPage;
			pagiList = finalList.slice(start, end);
			renderData(pagiList);
			//
			//
		} else {
			//初始化overPage
			// overPage = pageNum_base;

			for (let i = 1; i <= pageNum_base; i++) {
				str += `
		${str_li}${lastLiNum + i}">${lastLiNum + i}</a></li>
		`;
			}
			pagination.innerHTML = `<li class="page-item prev">${str_prev}</li>${str}<li class="page-item next">${str_next}</li>`;
			start = (lastLiNum + 1) * itemPerPage - itemPerPage;
			end = (lastLiNum + 1) * itemPerPage;
			pagiList = finalList.slice(start, end);
			renderData(pagiList);
		}
	}
}
//分頁器
function paginav(arr) {
	str = "";
	pagination.innerHTML = "";
	// 1-3
	// 4-6
	// 7-9
	// 10-12
	//共有幾頁(幾個數字分頁鈕)
	pagitem = Math.ceil(arr.length / itemPerPage);
	let pageAmount = pagitem;
	//如果分頁鈕數量超過設定的基數, 則等於基數, 小於陣列筆數則等於陣列筆數
	if (pageAmount > pageNum_base) {
		pageAmount = pageNum_base;
	} else {
		pageAmount = Math.ceil(arr.length / itemPerPage);
	}
	// console.log("實際有", pagitem + "頁");
	// console.log("頁面只顯示出", pageAmount + "頁");
	//生成數字分頁鈕
	for (let i = 1; i <= pageAmount; i++) {
		str += `
		${str_li}${i}">${i}</a></li>
		`;
	}
	//如果實際頁數(跳鈕數)不超過3頁, 就不顯示前後鈕
	// console.log(Boolean(pageAmount > pageNum_base));
	if (pagitem <= pageNum_base) {
		pagination.innerHTML = str;
	} else {
		pagination.innerHTML = `${str}<li class="page-item next">${str_next}</li>`;
	}
	// li = document.querySelectorAll(".page-item");
	// li[0].classList.add("active");
}
//篩選條件按鈕
function filterRadio(e) {
	// console.log(e.target.dataset);
	//清空搜尋欄
	searchInput.value = "";
	const genderRadio = e.target.dataset.gender;
	pageStage = 1;
	if (genderRadio == "all") {
		finalList = allFriend;
		console.log("目前資料長度", finalList.length);
		renderData(finalList);
		paginav(finalList);
		//指定觸發按下分頁鈕所使用的陣列資料為allFriend;
		// filterObj = "allFriend";
		// advended.style.display = "none";
		advended.classList.add("none");
		clearAdvForm();
		// console.log("filterObj=", filterObj);
	} else if (genderRadio == "male") {
		finalList = allFriend.filter((item) => item.gender == "male");
		console.log("目前資料長度", finalList.length);
		renderData(finalList);
		paginav(finalList);
		// filterObj = "male";
		// advended.style.display = "none";
		advended.classList.add("none");
		clearAdvForm();
		// console.log("filterObj=", filterObj);
	} else if (genderRadio == "female") {
		finalList = allFriend.filter((item) => item.gender == "female");
		console.log("目前資料長度", finalList.length);
		renderData(finalList);
		paginav(finalList);
		// filterObj = "female";
		// advended.style.display = "none";
		advended.classList.add("none");
		clearAdvForm();
		// console.log("filterObj=", filterObj);
	} else if (genderRadio == "friendList") {
		finalList = addList;
		console.log("目前資料長度", finalList.length);
		pageStage = 0; //心icon變心碎
		renderData(finalList);
		paginav(finalList);
		// filterObj = "friendList";
		advended.classList.add("none");
		// advended.style.display = "none";
		clearAdvForm();
		// console.log("filterObj=", filterObj);
	} else if (genderRadio == "advended") {
		finalList = emptyArr;
		// renderData(emptyArr);
		// paginav(emptyArr);
		console.log();
		// filterObj = "advended";
		// advended.style.display = "block";
		advended.classList.toggle("none");
		// console.log("filterObj=", filterObj);

		// eee++;
		// console.log(eee);
	}
}
//個人資料
function profile(id) {
	axios
		.get(BASE_URL + id)
		.then((res) => {
			// console.log(res);
			const img = res.data.avatar;
			const name = res.data.name;
			const surname = res.data.surname;
			const gender = res.data.gender;
			const age = res.data.age;
			const birthday = res.data.birthday;
			const region = res.data.region;
			const email = res.data.email;
			const id = res.data.id;
			// console.log(img, name, gender, age, region, email);
			modalName.innerText = name + " " + surname;
			modalGender.innerText = gender;
			modalAge.innerText = age;
			modalBirthday.innerText = birthday;
			modalRegion.innerText = region;
			modalEmail.setAttribute("href", "mailto:" + email);
			modalContent.setAttribute("data-modal", id);
			modalImg.innerHTML = `
        <img src="${img}" alt="${name}" />
      `;
		})
		.catch((res) => {
			console.log("err");
		});
}
//撈資料呈現在頁面
function renderData(arrData, allItemPerPage) {
	// console.log("addList", addList);
	// console.log(arrData);
	//指定一頁要呈現幾筆, 預設為itemPerPage
	let items = allItemPerPage || itemPerPage;
	dataPanel.innerHTML = "";
	// console.log(pagitem);
	//傳入的資料要截取哪一段出來
	let newData = arrData.slice(0, items);
	// console.log(newData);
	for (item of newData) {
		// console.log(item.name);
		//男女符號判斷
		if (`${item.gender}` == "male") {
			gender = '<i class="fas fa-mars"></i>';
		} else {
			gender = '<i class="fas fa-venus"></i>';
		}
		//pageStage == 0; 心碎
		//pageStage == 1; 空心
		// 預設場景為所有名單, 心icon為空心, 如果pageStage為0, 場景則是我的最愛, 心icon換成心碎
		if (pageStage == 1) {
			addIcon = `<i class="far fa-heart add" title="ADD LIST" data-set=${item.id}></i>`;
		} else {
			addIcon = `<i class="fas fa-heart-broken del" title="ADD LIST" data-set=${item.id}></i>`;
		}
		// 如果名單中有和localStorage中我的最愛重複者, 則改為實心icon
		for (item2 of addList) {
			if (pageStage == 1 && item.id == item2.id) {
				addIcon = `<i class="fas fa-heart add" title="ADD LIST" data-set=${item.id}></i>`;
			}
		}
		dataPanel.innerHTML += `
      <div class="col col-12 col-sm-4 col-xl-2">
        <div class="card ${item.gender}">
          <div class="icon">
          ${gender}            
          </div>
          <img
            src="${item.avatar}"
            class="card-img-top"
            alt="${item.name} ${item.surname}"
          />
          <div class="card-body" data-set=${item.id}>
            <h5 class="card-title">${item.name} ${item.surname}</h5>
            <a
              href="#"
              class="btn btn-primary meet"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"              
              >meet</a
            >
						${addIcon}
          </div>
        </div>
      </div>`;
	}
}
//個資卡片各項機制
function showModal(e) {
	// console.log(e.target);
	const id = e.target.parentElement.dataset.set;
	if (e.target.matches(".meet")) {
		profile(id);
	} else if (e.target.matches(".add")) {
		//如果有.add是空心狀態, 判斷有沒有加過清單
		// console.log(id);
		addLike(id);
		//切換class把空心改為實心
		e.target.classList.remove("far");
		e.target.classList.add("fas");
	} else if (e.target.matches(".del")) {
		//心碎代表在我的最愛, 按下則移除
		let delNum = addList.findIndex((item) => item.id == id);
		addList.splice(delNum, 1);
		localStorage.setItem("friends", JSON.stringify(addList));
		renderData(addList);
		paginav(addList);
		// console.log("finalList", finalList);
	}
}
