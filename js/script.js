// drawer
jQuery("#js-drawer-icon").on("click", function (e) {
  //   プラグが元々持っているツールを無効果する
  e.preventDefault();
  //   drawer--iconにis-checkedがチェック時に付与される
  jQuery("#js-drawer-icon").toggleClass("is-checked");
  //   drawer--contentにis-checkedがチェック時に付与される
  jQuery("#js-drawer-content").toggleClass("is-checked");
});

//scroll
// スクロールされた際にドロワーが閉じる指定
jQuery(`#js-drawer-content a[href^="#"]`).on("click", function (e) {
  //   drawer--iconにis-checkedがチェック時に外れる
  jQuery("#js-drawer-icon").removeClass("is-checked");
  //   drawer--contentにis-checkedがチェック時に外れる
  jQuery("#js-drawer-content").removeClass("is-checked");
});

// スクロールするとロゴの色変更
$(function () {
  $(window).on("scroll", function () {
    const sliderHeight = $(".js-header").height();
    let scrollThreshold = 5; // デフォルトはPCの時の倍率
    if (window.innerWidth < 768) {
      scrollThreshold = 3; // スマホの時の倍率
    }

    if (sliderHeight * scrollThreshold < $(this).scrollTop()) {
      $(".js-header").addClass("headerColorScroll");
    } else {
      $(".js-header").removeClass("headerColorScroll");
    }
  });
});

// const mySwiper = new Swiper("#js-about-swiper", {
//   loop: true, //最後→最初に戻るループ再生を有効に
//   autoplay: {
//     delay: 0,
//   },
//   speed: 6000, //表示切り替えのスピード
//   effect: "slide", //切り替えのmotion
//   centeredSlides: true, //中央寄せ
//   loopedSlides: 2, // ループ時に追加されるスライドの数
//   allowTouchMove: true, // スワイプで表示の切り替えを無効に
//   slidesPerView: "auto",
//   spaceBetween: 25,

//   on: {
//     init: function () {
//       addDummySlides(this);
//     },
//   },

//   // ページネーション
//   pagination: {
//     el: ".p-fv__swiper-pagination",
//     type: "progressbar",
//     // clickable: true,
//   },
// });

const swiper = new Swiper("#js-about-swiper", {
  // Optional parameters
  // direction: 'vertical',
  loop: true,
  spaceBetween: 33,
  slidesPerView: "auto",
  speed: 5000, // ループの時間
  autoplay: {
    delay: 0, // 途切れなくループ
  },
  // If we need pagination
  pagination: {
    el: ".p-about__swiper-pagination",
    type: "progressbar",
    clickable: true,
  },
});

$(function () {
  // 変数を要素をセット
  var $filterButtons = $(".sp-list [data-filter]"); // 全てのフィルターボタン
  var $items = $(".p-filter__items [data-item]"); // フィルタリング対象のアイテム
  var $allFilterButton = $(".sp-list [data-filter=all]"); // 「すべて」ボタン
  var selectedFilters = []; // 選択されたフィルターを保持する配列

  // カテゴリフィルター（「すべて」以外）のクリック処理
  $filterButtons.not($allFilterButton).on("click", function (e) {
    e.preventDefault();
    var $this = $(this);

    // 「すべて」ボタンからアクティブクラスを削除
    $allFilterButton.removeClass("is-active");

    // クリックしたフィルターのアクティブ状態をトグル
    $this.toggleClass("is-active");

    // selectedFilters 配列を更新
    var filterValue = $this.attr("data-filter");
    if ($this.hasClass("is-active")) {
      // 配列にフィルターがなければ追加
      if (selectedFilters.indexOf(filterValue) === -1) {
        selectedFilters.push(filterValue);
      }
    } else {
      // 配列からフィルターを削除
      var index = selectedFilters.indexOf(filterValue);
      if (index !== -1) {
        selectedFilters.splice(index, 1);
      }
    }

    // もしアクティブな個別フィルターが一つもなくなったら、「すべて」をアクティブにする
    if (
      $(".sp-list [data-filter].is-active").not($allFilterButton).length === 0
    ) {
      $allFilterButton.addClass("is-active");
      selectedFilters = []; // 選択フィルターもリセット
    }

    applyFilters();
  });

  // 「すべて」ボタンのクリック処理
  $allFilterButton.on("click", function (e) {
    e.preventDefault();
    var $this = $(this);

    // 他のフィルターボタン（「すべて」以外）のアクティブクラスを削除
    $filterButtons.not($allFilterButton).removeClass("is-active");

    // 「すべて」ボタンのアクティブ状態をトグル（元のネストされたイベント内の挙動を尊重）
    // もし「すべて」をクリックしたら必ずアクティブにしたい場合は .addClass("is-active") を使用
    $this.toggleClass("is-active");

    // 「すべて」ボタンがアクティブなら、選択フィルターをクリア
    if ($this.hasClass("is-active")) {
      selectedFilters = [];
    }
    // もし「すべて」が非アクティブになった場合の挙動も定義が必要ならここに追加
    // (例: 何も表示しない、または再度全フィルターをチェックするなど)

    applyFilters();
  });

  // フィルターを適用しアイテムを表示/非表示にする関数
  function applyFilters() {
    // アイテムを一旦フェードアウトし、アニメーション完了後に処理を続行
    $items
      .fadeOut(400)
      .promise()
      .done(function () {
        if (
          selectedFilters.length === 0 &&
          $allFilterButton.hasClass("is-active")
        ) {
          // 「すべて」が選択されている（またはアクティブなフィルターがない）場合、全アイテムを表示
          $items.addClass("is-active").fadeIn(400, function () {
            // fadeIn完了後にdisplay:flexを適用
            // $(this) はfadeInした各要素を指す
            $(this).css("display", "flex");
          });
        } else if (selectedFilters.length > 0) {
          // 特定のフィルターが選択されている場合
          var $itemsToShow = $(); // 表示するアイテムを格納するjQueryオブジェクト
          $items.removeClass("is-active").each(function () {
            // まず全アイテムからis-activeクラスを削除
            var $currentItem = $(this);
            var itemFilterValues = $currentItem.attr("data-item")
              ? $currentItem.attr("data-item").split(" ")
              : [];
            // アイテムが持つフィルターのいずれかが選択されたフィルターに含まれていれば表示対象
            if (
              selectedFilters.some((filter) =>
                itemFilterValues.includes(filter)
              )
            ) {
              $itemsToShow = $itemsToShow.add($currentItem);
            }
          });
          // 表示対象のアイテムにis-activeクラスを付与し、fadeInで表示
          $itemsToShow.addClass("is-active").fadeIn(400, function () {
            $(this).css("display", "flex");
          });
        } else {
          // フィルターが選択されておらず、「すべて」もアクティブでない場合は何も表示しない
          // (このケースは、$allFilterButton の toggleClass の結果による)
          // $items は既に fadeOut されている
        }
      });
  }

  // ドロワーメニュー関連のコード (変更なし)
  $(".js-category").on("click", function (e) {
    e.preventDefault();
    $(".js-list").toggleClass("is-checked");

    if ($(".js-list").hasClass("is-checked")) {
      $("body").css("overflow", "hidden");
    } else {
      $("body").css("overflow", "");
    }
  });

  $("#js-list-icon").on("click", function (e) {
    e.preventDefault();
    $(".js-list").toggleClass("is-checked");

    if ($(".js-list").hasClass("is-checked")) {
      $("body").css("overflow", "hidden");
    } else {
      $("body").css("overflow", "");
    }
  });

  // 初期表示時に「すべて」をアクティブにする場合 (任意)
  // $allFilterButton.addClass("is-active").trigger("click"); // trigger clickでapplyFiltersも実行
  // または
  // if ($allFilterButton.length) { // ボタンが存在する場合のみ
  //   $allFilterButton.addClass("is-active");
  //   applyFilters();
  // }
});

// 詳細絞り込み //
$(".js-detail").on("click", function (e) {
  e.preventDefault();
  $(".js-list__detail").toggleClass("is-checked");

  // ドロワーメニューが開いている場合はスクロールを無効化
  if ($(".js-list__detail").hasClass("is-checked")) {
    $("body").css("overflow", "hidden");
  } else {
    $("body").css("overflow", "");
  }
});

$("#js-detail-icon").on("click", function (e) {
  e.preventDefault();
  $(".js-list__detail").removeClass("is-checked");

  // メニューが閉じられた場合はスクロールを有効化
  if ($(".js-list__detail").hasClass("is-checked")) {
    $("body").css("overflow", "hidden");
  } else {
    $("body").css("overflow", "");
  }
});

$(function () {
  // 変数を要素をセット
  var $filter = $(".sp-list__detail [data-filter]"),
    $buttons = $(".sp-list__detail [data-filter]"),
    $item = $(".p-filter__items [data-item]"),
    $firstSp = $(".sp-list__detail [data-filter=all]"),
    selectedFilters = []; // 選択されたフィルターを保持する配列

  // 初期状態では4番目以降の要素を非表示
  $item.each(function (index) {
    if (index >= 3) {
      $(this).addClass("card-hidden");
    }
  });

  // カテゴリをクリックしたら
  $filter.click(function (e) {
    // デフォルトの動作をキャンセル
    e.preventDefault();
    var $this = $(this);

    // クリックしたカテゴリにクラスを付与または削除
    $this.toggleClass("is-active");

    // クリックした要素のdata属性を取得
    var $filterItem = $this.attr("data-filter");

    // 選択されたフィルターを更新
    if ($this.hasClass("is-active")) {
      selectedFilters.push($filterItem);
    } else {
      var index = selectedFilters.indexOf($filterItem);
      if (index !== -1) {
        selectedFilters.splice(index, 1);
      }
    }

    $item.fadeOut();

    // 選択されたフィルターに対応するアイテムを表示
    if (selectedFilters.length === 0) {
      $item.addClass("is-active").fadeIn();
    } else {
      $item.each(function () {
        var $item = $(this),
          itemFilters = $item.attr("data-item").split(" "); // アイテムが持つフィルターを配列に分割
        if (selectedFilters.some((filter) => itemFilters.includes(filter))) {
          $item.addClass("is-active").fadeIn();
        }
      });
    }
  });
});

//// 絞り込み機能(pc) /////

$(function () {
  var $item = $(".p-filter__items [data-item]"),
    $buttons = $(".filter-list [data-filter]"),
    $firstButton = $(".filter-list [data-filter=all]"),
    $filterButton = $("#filter-button"),
    selectedFilters = []; // 初期値は空の配列としておく

  // カテゴリをクリックしたら
  $buttons.click(function () {
    var $button = $(this),
      filter = $button.attr("data-filter");

    // 「すべて」ボタンからアクティブクラスを削除
    $firstButton.removeClass("is-active");

    // 選択されている場合は配列から削除、そうでない場合は追加
    if ($button.hasClass("is-active")) {
      var index = selectedFilters.indexOf(filter);
      if (index !== -1) {
        selectedFilters.splice(index, 1);
      }
    } else {
      selectedFilters.push(filter);
    }

    // ボタンのアクティブ状態を切り替える
    $button.toggleClass("is-active");
  });

  // 「すべて」をクリックしたら
  $firstButton.click(function () {
    // ボタンすべてのアクティブクラスを削除
    $buttons.removeClass("is-active");

    // 選択されたフィルターをリセット
    selectedFilters = [];

    // 「すべて」のアクティブ状態を切り替える
    $firstButton.toggleClass("is-active");

    // すべてのアイテムを表示
    $item.addClass("is-active").fadeIn();
  });

  // ボタンをクリックしたら
  $filterButton.click(function (e) {
    e.preventDefault();
    filterItems();
  });

  // アイテムのフィルタリング機能
  function filterItems() {
    $item.each(function () {
      var $this = $(this),
        itemFilters = $this.attr("data-item").split(" ");

      // アイテムのカテゴリが選択されたカテゴリに含まれるかどうかをチェック
      var isVisible = itemFilters.some(function (filter) {
        return selectedFilters.indexOf(filter) !== -1;
      });

      // アイテムを表示または非表示にする
      if (isVisible) {
        $this.addClass("is-active").fadeIn();
      } else {
        $this.removeClass("is-active").fadeOut();
      }
    });
  }
});

window.addEventListener("load", function () {
  // ロード完了時に処理が実行される
  const loadingScreen = document.querySelector("#loading");
  const loadingEndTime = 2000; // 読み込み完了した後の発火までの時間

  setTimeout(() => {
    loadingScreen.classList.add("js-loading-end");
    // 実行完了したら完全にloading画面を非表示にさせます
    setTimeout(() => {
      loadingScreen.style.display = "none";
    }, 1000);
  }, loadingEndTime);
});

window.addEventListener("load", function () {
  gsap.registerPlugin(ScrollTrigger);

  const timeDelay = 150; // 時間差のタイミング(ミリ秒)
  const maxItemNumber = 12; // 時間差で発火させる最大要素数

  // fade in
  for (let i = 0; i < maxItemNumber; i++) {
    const fadeInItems = document.querySelectorAll(
      `.animated__fadeIn.--delay${i}`
    );
    fadeInFunction(fadeInItems, i * timeDelay);
  }

  function fadeInFunction(fadeInItems, timeout) {
    fadeInItems.forEach((item) => {
      ScrollTrigger.create({
        trigger: item,
        start: "top 80%", // 要素が上部から70%の位置で発火
        //スクラブアニメーション（スクロールによってアニメーションが発火する）
        scrub: true,
        // markers: true,
        onEnter: () => {
          // 要素内に入ったら、js-showクラスをつける
          setTimeout(() => {
            item.classList.add("js-show");
          }, timeout);
        },
      });
    });
  }
});

// ここにアニメーションの記述

gsap.fromTo(
  //ターゲット
  ".p-about__container .p-about__title",

  //最初の状態
  {
    opacity: 0,
    x: 100,
    y: 100,
    rotate: 90,
  },

  //最後の状態
  {
    opacity: 1,
    x: 0,
    y: 0,
    rotate: 0,
    scrollTrigger: {
      //どの要素が
      trigger: ".p-about__container .p-about__title",
      //.image .image1 のtopが画面のcenterに入った時
      start: "top 300%",
      //スクラブアニメーション（スクロールによってアニメーションが発火する）
      scrub: true,
    },
  }
);

window.addEventListener("load", function () {
  gsap.registerPlugin(ScrollTrigger);

  const clipViewItems = document.querySelectorAll(".animated__clipView");
  clipViewItems.forEach((item) => {
    ScrollTrigger.create({
      trigger: item,
      start: "top 70%", // 要素が上部から70%の位置で発火
      onEnter: () => {
        // 要素内に入ったら、js-showクラスをつける
        item.classList.add("js-show");
      },
    });
  });
});

//1文字ずつ表示
window.addEventListener("load", function () {
  gsap.registerPlugin(ScrollTrigger);
  const slideUpText = document.querySelectorAll(".animated__slideUp");
  new SplitType(slideUpText);
  slideUpText.forEach((item) => {
    ScrollTrigger.create({
      trigger: item,
      start: "top 70%", // 要素が上部から70%の位置で発火
      onEnter: () => {
        const chars = item.querySelectorAll(".char");
        gsap.to(chars, {
          y: 0,
          stagger: 0.01, //次のアニメーションまでの時間
        });
      },
    });
  });
});
