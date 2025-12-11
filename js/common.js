// =========================
// UTILITY FUNCTIONS
// =========================

// DOM 유틸리티 - 안전한 element 선택
const safeQuerySelector = (selector, context = document) => {
    try {
        return context.querySelector(selector);
    } catch (error) {
        console.warn(`Invalid selector: ${selector}`, error);
        return null;
    }
};

const safeQuerySelectorAll = (selector, context = document) => {
    try {
        return context.querySelectorAll(selector);
    } catch (error) {
        console.warn(`Invalid selector: ${selector}`, error);
        return [];
    }
};

// 클래스 조작 유틸리티
const toggleClass = (elements, className, force = undefined) => {
    if (!elements) return;

    const elementsArray = Array.isArray(elements) ? elements : [elements];
    elementsArray.forEach(el => {
        if (el && el.classList) {
            if (force !== undefined) {
                el.classList.toggle(className, force);
            } else {
                el.classList.toggle(className);
            }
        }
    });
};

const addClass = (elements, className) => {
    toggleClass(elements, className, true);
};

const removeClass = (elements, className) => {
    toggleClass(elements, className, false);
};



// =========================
// ORIGINAL FUNCTIONS (REFACTORED)
// =========================

// modal
const setModal = (target) => {
    const targetElement = typeof target === 'string' ? safeQuerySelector(`#${target}`) : target;
    if (!targetElement) return;

    targetElement.style.display = 'flex';
/*
    setTimeout(() => {
        addClass(targetElement, 'is-active');
        if (!document.body.classList.contains('modal-open')) {
            addClass(document.body, 'modal-open');
        }
    }, 300);
*/
    requestAnimationFrame(() => {
        addClass(targetElement, 'is-active');
        addClass(document.body, 'modal-open');
    });
}
window.setModal = setModal;

// 모달 열기
const openModal = (event, type) => {
    event.preventDefault();
    const btn = event.currentTarget;
    const modalId = btn.getAttribute('data-modal-id');
    

    const target = safeQuerySelector(`#${modalId}`);
    if (target) {
        setModal(modalId);
    }
};
window.openModal = openModal;

// 모달 외부 클릭 이벤트 핸들러
/* 외부 클릭 이벤트 주석처리
document.addEventListener("click", function(e) {
    if (e.target.classList.contains('modal__wrap--bg')) {
        setTimeout(() => {
            removeClass(e.target, 'is-active');
            removeClass(document.body, 'modal-open');
        }, 300);
        e.target.style.display = 'none';
    }
});
*/

//모달창 닫기
const closeModal = (event, openButton) => {
    const btn = event.currentTarget;
    const activeModal = btn.closest('.cmp-modal');

    const totalModal = safeQuerySelectorAll('.cmp-modal.is-active');
    const modalLength = totalModal.length;

    if (activeModal) {
        removeClass(activeModal, 'is-active');

        if (modalLength <= 1) {
            removeClass(document.body, 'modal-open');

            setTimeout(() => {
                activeModal.style.display = 'none';
            }, 300);
        }
    }
};
window.closeModal = closeModal;


/* gnb (s) */
let currentMode = null; // "pc" 또는 "mobile"

function initGnbState() {
    const gnbList = document.querySelector(".gnb");
    if (!gnbList) return;

    // 모든 active 제거
    gnbList.classList.remove("active");
    gnbList.querySelectorAll(":scope > li.active")
        .forEach(li => li.classList.remove("active"));
}

function bindMobileEvents() {
    const gnbList = document.querySelector(".gnb");
    const anchors = gnbList.querySelectorAll(":scope > li > a");

    anchors.forEach(a => {
        a._mobileHandler = function(e) {
            if (currentMode !== "mobile") return;

            e.preventDefault();
            e.stopPropagation();

            const li = a.closest('li');
            if (!li) return;

            const alreadyActive = li.classList.contains("active");

            // 다른 active 제거
            gnbList.querySelectorAll(":scope > li.active")
                .forEach(act => act.classList.remove("active"));

            // toggle
            if (!alreadyActive) li.classList.add("active");
        };

        a.addEventListener("click", a._mobileHandler);
    });
}

function unbindMobileEvents() {
    const gnbList = document.querySelector(".gnb");
    const anchors = gnbList.querySelectorAll(":scope > li > a");

    anchors.forEach(a => {
        if (a._mobileHandler) {
            a.removeEventListener("click", a._mobileHandler);
            delete a._mobileHandler;
        }
    });
}

function bindPcEvents() {
    const gnbList = document.querySelector(".gnb");

    gnbList._pcEnter = function() {
        if (currentMode === "pc") gnbList.classList.add("active");
    };
    gnbList._pcLeave = function() {
        if (currentMode === "pc") gnbList.classList.remove("active");
    };

    gnbList.addEventListener("mouseenter", gnbList._pcEnter);
    gnbList.addEventListener("mouseleave", gnbList._pcLeave);
}

function unbindPcEvents() {
    const gnbList = document.querySelector(".gnb");

    if (gnbList._pcEnter) {
        gnbList.removeEventListener("mouseenter", gnbList._pcEnter);
        delete gnbList._pcEnter;
    }
    if (gnbList._pcLeave) {
        gnbList.removeEventListener("mouseleave", gnbList._pcLeave);
        delete gnbList._pcLeave;
    }
}

function gnbOpen() {
    const isMobile = window.innerWidth < 1024;
    const newMode = isMobile ? "mobile" : "pc";

    if (currentMode === newMode) return; // 모드가 같으면 아무 것도 안 함 (중복 이벤트 방지)

    // 모드 변경
    currentMode = newMode;

    // 이벤트 초기화 + 상태 초기화
    unbindMobileEvents();
    unbindPcEvents();
    initGnbState();

    // 모드별 이벤트 재등록
    if (newMode === "mobile") {
        bindMobileEvents();
    } else {
        bindPcEvents();
    }
}
/* enb(e) */

// 상단 설문 종료버튼
const topClose = () => {
    const wrap = document.querySelector('.noti-wrap');
    const btn = document.querySelector('.btn-noti-close');

    if (!wrap.classList.contains('open')) {
        // 열기
        wrap.style.height = wrap.scrollHeight + 'px';
        wrap.classList.add('open');
        btn.textContent = '팝업닫기';
        btn.classList.add('close');
    } else {
        // 닫기
        wrap.style.height = wrap.scrollHeight + 'px';
        requestAnimationFrame(() => {
            wrap.style.height = '0';
        });
        wrap.classList.remove('open');
        btn.textContent = '팝업열기';
        btn.classList.remove('close');
    }
};


// dropdown
function DropdownMenus() {
    const dropdownButtons = document.querySelectorAll(".btn-dropdown");

    if (!dropdownButtons.length) return;

    dropdownButtons.forEach((btn) => {
        btn.addEventListener("click", function (e) {
            e.stopPropagation();

            const currentWrap = btn.closest(".dropdown-wrap");
            const isOpen = currentWrap.classList.contains("is-open");

            // 모든 드롭다운 닫기
            document.querySelectorAll(".dropdown-wrap.is-open").forEach((openWrap) => {
                openWrap.classList.remove("is-open");
            });

            if (!isOpen) {
                currentWrap.classList.add("is-open");
            }
        });
    });

    // 클릭 시 텍스트 변경
    document.querySelectorAll(".dropdown-select .dropdown-item").forEach((item) => {
        item.addEventListener("click", function (e) {
            e.stopPropagation();

            const selectedText = item.textContent;
            const wrap = item.closest(".dropdown-wrap");
            const btn = wrap.querySelector(".btn-dropdown");

            btn.textContent = selectedText;
            wrap.classList.remove("is-open");
        });
    });

    // 클릭 시 이동하고 닫기
    document.querySelectorAll(".dropdown-link .dropdown-item").forEach((item) => {
        item.addEventListener("click", function () {
            const wrap = item.closest(".dropdown-wrap");
            wrap.classList.remove("is-open");
        });
    });

    // 바깥 클릭 시 닫기
    document.addEventListener("click", function () {
        document.querySelectorAll(".dropdown-wrap.is-open").forEach((openWrap) => {
            openWrap.classList.remove("is-open");
        });
    });
}

let tabEventRegistry = [];
let moDropdownRegistry = [];
let mobileMenuHandler = null;
let parentTabRegistry = [];
let keepTabRegistry = []; //type02 (모바일에서도 탭 유지)
let subTabRegistry = [];

// tab
const initTabs = (containerSelector) => {
    const containers = safeQuerySelectorAll(containerSelector);
    if (!containers.length) return;

    containers.forEach(container => {
        const tabMenuWrap = container.querySelector('.tab-head');
        if (!tabMenuWrap) return;

        // 현재 tab-head의 직계 하위 탭만 선택 (중첩 탭 무시)
        const tabMenus = tabMenuWrap.querySelectorAll(':scope > li > .tab-menu');

        const isMobile = window.matchMedia('(max-width: 1024px)').matches;

        const scrollActiveTabIntoView = () => {
            if (isMobile) return;
            const activeTab = tabMenuWrap.querySelector('.tab-menu.is-active');
            if (activeTab && !activeTab.closest('.swiper.res-type')) {
                activeTab.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                });
            }
        };

        tabMenuWrap.addEventListener('click', (event) => {
            const clickedTab = event.target.closest('.tab-menu');
            if (!clickedTab || !tabMenuWrap.contains(clickedTab)) return;
            event.stopPropagation();

            // 직속 탭만 비활성화
            tabMenus.forEach(tab => removeClass(tab, 'is-active'));
            addClass(clickedTab, 'is-active');

            const targetId = clickedTab.getAttribute('data-tab');
            if (!targetId) return;

            // 현재 컨테이너 범위에서만 tab-content 활성화
            const targetContent = container.querySelector(`#${targetId}`);
            if (targetContent) {
                const siblings = Array.from(targetContent.parentElement.children);
                siblings.forEach(content => {
                    if (content.classList.contains('tab-content')) {
                        removeClass(content, 'is-active');
                    }
                });
                addClass(targetContent, 'is-active');
            }

            scrollActiveTabIntoView();
        });
    });
};

function destroyParentTabs() {
    parentTabRegistry.forEach(entry => {
        entry.element.removeEventListener('click', entry.handler);
    });
    parentTabRegistry = [];
}

// mobile 라디오, 탭 드롭다운 공통처리
function initMoDropdown() {
    const dropdowns = document.querySelectorAll('.mo-drop');

    dropdowns.forEach(dropdown => {
        const toggleButton = dropdown.querySelector('.mo-btn-dropdown');
        const dropdownList = dropdown.querySelector('.mo-dropdown-list');
        const items = dropdownList.querySelectorAll('.tab-menu, .radio-item');

        // toggle handler
        const toggleHandler = (e) => {
            e.stopPropagation();
            document.querySelectorAll('.mo-drop.is-open').forEach(d => {
                if(d !== dropdown) removeClass(d, 'is-open');
            });
            toggleClass(dropdown, 'is-open');
        };
        toggleButton.addEventListener('click', toggleHandler);
        moDropdownRegistry.push({ element: toggleButton, handler: toggleHandler });

        // item click handler
        items.forEach(item => {
            const itemHandler = (e) => {
                e.stopPropagation();
                let labelText = '';

                if(item.classList.contains('tab-menu')) {
                    const tabId = item.getAttribute('data-tab');
                    const container = dropdown.closest('.tab-container');
                    if(container){
                        const tabMenus = container.querySelectorAll('.mo-dropdown-list .tab-menu');
                        const tabContents = container.querySelectorAll('.mo-drop + .tab-content-wrap > .tab-content');

                        tabMenus.forEach(menu => removeClass(menu,'is-active'));
                        addClass(item,'is-active');

                        tabContents.forEach(content => {
                            removeClass(content,'is-active');
                            if(content.id === tabId) addClass(content,'is-active');
                        });
                    }
                    labelText = item.textContent;
                }

                if(item.classList.contains('radio-item')) {
                    const input = item.querySelector('input[type="radio"]');
                    if(input){
                        input.checked = true;
                        const name = input.getAttribute('name');
                        document.querySelectorAll(`input[name="${name}"]`).forEach(r => {
                            removeClass(r.closest('.radio-item'),'is-active');
                        });
                        addClass(item,'is-active');
                        labelText = item.textContent.trim();
                    }
                }

                if(labelText) toggleButton.textContent = labelText;
                removeClass(dropdown, 'is-open');
            };
            item.addEventListener('click', itemHandler);
            moDropdownRegistry.push({ element: item, handler: itemHandler });
        });
    });

    document.addEventListener('click', closeAllMoDropdowns);
}

function closeAllMoDropdowns() {
    document.querySelectorAll('.mo-drop.is-open').forEach(open => removeClass(open,'is-open'));
}

function destroyMoDropdown() {
    moDropdownRegistry.forEach(entry => entry.element.removeEventListener('click', entry.handler));
    moDropdownRegistry = [];
    document.removeEventListener('click', closeAllMoDropdowns);
}

// mobile - 상단 검색버튼
function moBtnSchFn(){
    const btn = document.querySelector('.mo-btn-grp .mo-btn-search');
    const target = document.querySelector('.head-top .sch-area');

    if(!btn || !target) return

    btn.addEventListener('click', (e)=>{
        e.currentTarget.classList.toggle('close');

        if(e.currentTarget.classList.contains('close')){
            e.currentTarget.textContent = "닫기버튼";
            target.classList.add('active');
        }else{
            e.currentTarget.textContent = "검색버튼";
            target.classList.remove('active');
        }
    });
}

// mobile - 상단 전체메뉴   
function allMnuFn() {
    const header = document.querySelector('header');
    const btn = document.querySelector('.mo-btn-grp .mo-btn-mnu');
    const btnSch = document.querySelector('.mo-btn-grp .mo-btn-search');
    const target = document.querySelector('header .head-bottom');
    if(!header || !btn || !btnSch || !target) return;
    const gnbBtn = target.querySelectorAll('.gnb > li');

    // 기존 핸들러 제거
    if(mobileMenuHandler) btn.removeEventListener('click', mobileMenuHandler);

    mobileMenuHandler = (e) => {
        target.classList.toggle('mo-open');
        toggleClass(header,'bg');
        e.currentTarget.classList.toggle('close');
        if(e.currentTarget.classList.contains('close')){
            e.currentTarget.textContent = "메뉴닫기";
            btnSch.style.display = 'none';
        } else {
            e.currentTarget.textContent = "메뉴열기";
            btnSch.style.display = 'block';
        }
    };

    btn.addEventListener('click', mobileMenuHandler);

    gnbBtn.forEach((el)=>{
        el.addEventListener('click',(e)=>{
            e.stopPropagation();
            const li = e.target.closest('li'); // 클릭 대상의 li
            if(!li) return;

            const isActive = li.classList.contains('active');
            gnbBtn.forEach(l => removeClass(l,'active'));

            if(!isActive) addClass(li,'active');
        });
    });
}

function destroyAllMnuFn(){
    const btn = document.querySelector('.mo-btn-grp .mo-btn-mnu');
    if(btn && mobileMenuHandler){
        btn.removeEventListener('click', mobileMenuHandler);
        mobileMenuHandler = null;
    }
}

// scrollController
function scrollControlFn() {
    const wraps = document.querySelectorAll('.scroll-wrap');

    wraps.forEach(wrap => {
        if (wrap.__scrollInit) return;
        wrap.__scrollInit = true;

        const scrollInner = wrap.querySelector('.scroll');
        const progress = wrap.querySelector('.scroll-controller .scroll-progress');
        const thumb = wrap.querySelector('.scroll-controller .scroll-thumb');
        const btnLeft = wrap.querySelector('.scroll-controller .btn-left');
        const btnRight = wrap.querySelector('.scroll-controller .btn-right');

        if (!scrollInner || !progress || !thumb) return;

        // update
        const updateThumb = () => {
            if (scrollInner.offsetParent === null) return;

            const ratio = scrollInner.clientWidth / Math.max(1, scrollInner.scrollWidth);
            const thumbWidth = Math.max(16, ratio * progress.clientWidth); //최소width
            const maxScroll = scrollInner.scrollWidth - scrollInner.clientWidth;
            const scrollRatio = maxScroll > 0 ? (scrollInner.scrollLeft / maxScroll) : 0;
            const trackWidth = Math.max(0, progress.clientWidth - thumbWidth);

            thumb.style.width = `${thumbWidth}px`;
            thumb.style.left = `${scrollRatio * trackWidth}px`;

            // controller
            const controller = wrap.querySelector('.scroll-controller');
            if (controller) {
                if (scrollInner.scrollWidth <= scrollInner.clientWidth + 1) {
                    controller.style.display = 'none';
                } else {
                    controller.style.display = '';
                }
            }
        };

        setTimeout(updateThumb, 50);

        // 바인딩
        scrollInner.addEventListener('scroll', updateThumb);
        window.addEventListener('resize', updateThumb);

        // 버튼 클릭
        if (btnLeft) btnLeft.addEventListener('click', () => {
            const amount = window.innerWidth < 1025 ? 181 : 266;
            scrollInner.scrollBy({ left: -amount, behavior: 'smooth' });
        });
        if (btnRight) btnRight.addEventListener('click', () => {
            const amount = window.innerWidth < 1025 ? 181 : 266;
            scrollInner.scrollBy({ left: amount, behavior: 'smooth' });
        });

        // thumb 드래그
        let isDragging = false;
        let startX = 0;
        let startLeft = 0;

        const onPointerDown = (e) => {
            isDragging = true;
            startX = (e.clientX !== undefined) ? e.clientX : e.touches?.[0]?.clientX;
            startLeft = parseFloat(getComputedStyle(thumb).left) || 0;
            document.body.style.userSelect = 'none';
            thumb.setPointerCapture && thumb.setPointerCapture(e.pointerId);
        };

        const onPointerMove = (e) => {
            if (!isDragging) return;
            const clientX = (e.clientX !== undefined) ? e.clientX : e.touches?.[0]?.clientX;
            const delta = clientX - startX;
            const trackWidth = Math.max(0, progress.clientWidth - thumb.clientWidth);
            let newLeft = Math.max(0, Math.min(trackWidth, startLeft + delta));

            // thumb 위치 적용
            thumb.style.left = `${newLeft}px`;

            // 스크롤 대응
            const maxScroll = scrollInner.scrollWidth - scrollInner.clientWidth;
            const scrollRatio = trackWidth > 0 ? (newLeft / trackWidth) : 0;
            scrollInner.scrollLeft = scrollRatio * maxScroll;
        };

        const onPointerUp = (e) => {
            if (!isDragging) return;
            isDragging = false;
            document.body.style.userSelect = '';
            thumb.releasePointerCapture && thumb.releasePointerCapture(e.pointerId);
        };

        if (window.PointerEvent) {
            thumb.addEventListener('pointerdown', onPointerDown);
            window.addEventListener('pointermove', onPointerMove);
            window.addEventListener('pointerup', onPointerUp);
        } else {
            thumb.addEventListener('mousedown', onPointerDown);
            window.addEventListener('mousemove', onPointerMove);
            window.addEventListener('mouseup', onPointerUp);

            // touch
            thumb.addEventListener('touchstart', onPointerDown, { passive: true });
            window.addEventListener('touchmove', onPointerMove, { passive: false });
            window.addEventListener('touchend', onPointerUp);
        }

        // track click
        progress.addEventListener('click', (e) => {
            if (e.target === thumb) return;
            const rect = progress.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const thumbWidth = thumb.clientWidth;
            const trackWidth = Math.max(0, progress.clientWidth - thumbWidth);

            const newLeft = Math.max(0, Math.min(trackWidth, clickX - thumbWidth / 2));
            const maxScroll = scrollInner.scrollWidth - scrollInner.clientWidth;
            const scrollRatio = trackWidth > 0 ? (newLeft / trackWidth) : 0;
            const targetScroll = scrollRatio * maxScroll;

            scrollInner.scrollTo({ left: targetScroll, behavior: 'auto'});

            // 업데이트
            requestAnimationFrame(updateThumb);
        });

        // tab 등으로 보이기 상태가 변경됐을 때 재계산 필요하면 외부에서 호출하도록 메서드 노출
        wrap.updateScrollThumb = updateThumb;
    });

    // 전역으로 재계산 빠르게 호출할 유틸
    window.updateAllScrollThumbs = function() {
        document.querySelectorAll('.scroll-wrap').forEach(w => {
            if (w.updateScrollThumb) w.updateScrollThumb();
        });
    };
}


//예약하기 인원추가
function resAddFn(){
    const usrList = document.querySelector(".usr-list");
    if(!usrList){
        return
    }
    
    const addBtn = usrList.querySelector(".btn-add");
    const addLi = usrList.querySelector(".add-li");
    // 원본 li
    const baseLi = usrList.querySelector("li:not(.add-li)");

    let userIndex = 1;

    addBtn.addEventListener("click", () => {
        // li clone
        const newLi = baseLi.cloneNode(true);

        userIndex++;

        // 복제한 li 내부의 input/select/textarea/id/label for 갱신
        newLi.querySelectorAll("[id]").forEach((el) => {
            const oldId = el.id;
            const newId = `${oldId}_${userIndex}`;
            el.id = newId;

            // 연결된 label의 for도 함께 수정
            const label = newLi.querySelector(`label[for='${oldId}']`);
            if (label) label.setAttribute("for", newId);
        });

        // value init
        newLi.querySelectorAll("input, select, textarea").forEach((el) => {
            if (el.tagName === "SELECT") el.selectedIndex = 0;
            else el.value = "";
        });

        // li추가
        usrList.insertBefore(newLi, addLi);
    });

    // 삭제 버튼
    usrList.addEventListener("click", (e) => {
        if (e.target.classList.contains("btn-del")) {
            e.target.closest("li").remove();
        }
    });
}

// bbs - accodion
function bbsAccoFn() {
    const accoBtn = document.querySelectorAll('.bbs-list.acco li .btn-acco');
    if (!accoBtn) return;

    accoBtn.forEach((el) => {
        el.addEventListener('click', (e) => {
            const targetItem = e.currentTarget.closest("li");
            const list = targetItem.parentElement.querySelectorAll("li");

            // 모든 형제 li에서 on 제거
            list.forEach(li => {
                li.classList.remove('on');
            });

            // 클릭한 li만 toggle
            targetItem.classList.add('on');
        });
    });
}

// Top버튼 공통
function btnTopFn(){
    const btnTop = document.querySelector("#btnTop");;

    if(!btnTop) return;

    window.addEventListener("scroll", () => {
        if (window.scrollY > 300) {
            btnTop.classList.add("show");
        } else {
            btnTop.classList.remove("show");
        }
    });

    btnTop.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}

// 개인정보처리방침
function accoOpenByAnchor() {
    const anchorLinks = document.querySelectorAll('a[href^="#cont"]');

    if(!anchorLinks) return;

    anchorLinks.forEach(a => {
        a.addEventListener("click", (e) => {
            const targetId = a.getAttribute("href"); // #cont1
            const targetLi = document.querySelector(targetId);

            if (!targetLi) return;

            // 기본 앵커 스크롤 작동 전에 아코디언 열어주기
            setTimeout(() => {
                // 동일 리스트 내의 모든 .on 제거
                const parentList = targetLi.parentElement.querySelectorAll("li");
                parentList.forEach(li => li.classList.remove("on"));

                // 해당 li만 ON
                targetLi.classList.add("on");

                // 아코디언 열리고 난 뒤 정확한 위치로 스크롤 재조정
                targetLi.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 50);
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    DropdownMenus();
    initTabs('.tab-container.full');
    initTabs('.tab-container.sub');
    initTabs('.tab-container.notice-wrap');
    resAddFn();
    bbsAccoFn();
    btnTopFn();
    gnbOpen();
    initByMode();
});

let isMobileMode = window.innerWidth < 1024;
function initByMode() {

    if (isMobileMode) {
        // 이전 이벤트 제거
        destroyParentTabs();
        destroyMoDropdown();

        // 이벤트 등록
        initMoDropdown();
        allMnuFn();
        moBtnSchFn();
    } else {
        // 모바일 이벤트 제거
        destroyMoDropdown();
        destroyAllMnuFn();

        // PC 이벤트 등록
        initTabs('.tab-container.full');
        initTabs('.tab-container.sub');
        initTabs('.tab-container.notice-wrap');
    }
}

// 리사이징 대응
window.addEventListener('resize',()=>{
    const nowMobile = window.innerWidth < 1024;
    if(nowMobile !== isMobileMode){
        isMobileMode = nowMobile;
        initByMode();
        gnbOpen();
    }
});