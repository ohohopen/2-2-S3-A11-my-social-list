# 我的社群名單

進階的資料篩選機制

## Features

- 串接 API 抓取每一個個人資料
- 分頁製作
- 上方的搜尋列可輸入字串篩選名單並即時呈現
- 點擊愛心 icon 加入我的最愛清單
- 判別性別加上左上角性別 icon
- 點擊 meet 可彈跳出詳細個資，個資中可連結 email 及按 like 加入我的最愛清單
- 上方按鈕有基本的 ALL、MALE、FEMALE 篩選功能
- 上方的 Friend List 可查看被 我的最愛清單
- 我的最愛清單可點擊心碎 icon 解除清單收藏
- 上方的 Advenced 可做進階篩選，依性別、星座、年齡做交叉搜尋

### 詳細個資

- 點擊 meet 可彈跳出詳細個資

### 搜尋

- 上方的搜尋列可輸入字串篩選名單並即時呈現

### 篩選

- 判別性別加上左上角性別 icon
- 上方按鈕有基本的 ALL、MALE、FEMALE 篩選功能
- 上方的 Friend List 可查看被 我的最愛清單
- 上方的 Advenced 可做進階篩選，依性別、星座、年齡做交叉搜尋

### 我的最愛

- 點擊愛心 icon 加入我的最愛清單
- 詳細個資中可點擊 like 加入我的最愛清單
- 我的最愛清單可點擊心碎 icon 解除清單收藏

## 技術解說

- 以 axios 串接外部 API
- 將物件存入 localStorage 以達到換頁時能保留我的最愛的清單
- 以字串篩選進行搜尋
- 在不同條件下建立出新的陣列存入共同的變數，使資料匯入都使用同一個變數
