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

/* gnb */
const gnbOpen = () => {
    const gnbList = document.querySelector(".gnb");
    const listItem = gnbList.querySelectorAll(".gnb > li > a");

    listItem.forEach((el)=>{
        el.addEventListener("mouseenter", (e)=>{
            if(!gnbList.classList.contains('active')){
                gnbList.classList.add('active');
            }
        });
    });

    gnbList.addEventListener("mouseleave", ()=>{
        gnbList.classList.remove('active');
    });
}

// 상단 설문 종료버튼
const topClose = () => {
    const targetLayer = document.querySelector(".top-noti");
    const closeBtn = targetLayer.querySelector(".btn-close");
    targetLayer.remove();
}

// 메인배너 우측 Accordion list 토글
const bnToggle = () => {
    const setLiHeight = (li) => {
        li.style.height = li.scrollHeight / 10 + 'rem';
    };

    const activeList = document.querySelector(".acco-wrap li.active");
    if(activeList){
        setTimeout(()=>{
            setLiHeight(activeList);
        }, 200);
    }
    
    const accoBtn = document.querySelectorAll(".acco-wrap li.item > button");
    accoBtn.forEach((el)=>{
        el.addEventListener("click", (e)=>{
            e.preventDefault();
            e.stopPropagation();
            const li = el.parentElement;
            const isActive = li.classList.contains('active');

            if(isActive){
                return
            }else{
                document.querySelectorAll(".acco-wrap li").forEach((el)=>{
                    el.classList.remove('active');
                    el.style.height = 11 + 'rem';
                });
                li.classList.add('active');
                setLiHeight(li);
            }
        });
    });
}

const accoSch = () => {
    const setItemHeight = (item) => {
        item.style.height = item.scrollHeight / 10 + 0.1 + 'rem';
    };

    const activeList = document.querySelector(".acco-wrap.search .item.active");
    if(activeList){
        setTimeout(()=>{
            setItemHeight(activeList);
        }, 200);
    }

    const accoBtn = document.querySelectorAll(".acco-wrap.search .item .icon-acco");
    accoBtn.forEach((el)=>{
        el.addEventListener("click", (e)=>{
            e.preventDefault();
            e.stopPropagation();
            const targetItem = el.closest(".item");
            const isActive = targetItem.classList.contains('active');

            if(isActive){
                targetItem.classList.remove('active');
                targetItem.style.height = 6.5 + 'rem';
            }else{
                targetItem.classList.add('active');
                setItemHeight(targetItem);
            }
        });
    });
}


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
            if (activeTab) {
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

// mobile 라디오, 탭 드롭다운 공통처리
function initMoDropdown() {
    const dropdowns = document.querySelectorAll('.mo-drop');

    dropdowns.forEach(dropdown => {
        const toggleButton = dropdown.querySelector('.mo-btn-dropdown');
        const dropdownList = dropdown.querySelector('.mo-dropdown-list');
        const items = dropdownList.querySelectorAll('.tab-menu, .radio-item');

        // 드롭다운 토글 버튼 클릭 시 열고 닫기
        toggleButton.addEventListener('click', function (e) {
            e.stopPropagation(); // 이벤트가 상위 요소로 전파되지 않게 처리

            // 탭 클릭 시 드롭다운을 닫기 위해서 다른 드롭다운이 열려 있으면 닫기
            document.querySelectorAll('.mo-drop.is-open').forEach(openDropdown => {
                if (openDropdown !== dropdown) {
                    openDropdown.classList.remove('is-open');
                }
            });

            dropdown.classList.toggle('is-open');
        });

        // 드롭다운 항목 클릭 시
        items.forEach(item => {
            item.addEventListener('click', function (e) {
                e.stopPropagation(); // 다른 요소로 이벤트 전파 차단

                let labelText = '';
                // tabmenu
                debugger
                if (item.classList.contains('tab-menu')) {
                    const tabId = item.getAttribute('data-tab');
                    const container = dropdown.closest('.tab-container'); 
                    // 각 드롭다운에 해당하는 탭만 찾기
                    if (container) {
                        const tabMenus = container.querySelectorAll('.mo-dropdown-list .tab-menu');
                        const tabContents = container.querySelectorAll('.mo-drop + .tab-content-wrap > .tab-content')

                        // 해당 컨테이너 내에서만 'is-active' 클래스를 관리
                        tabMenus.forEach(menu => menu.classList.remove('is-active'));
                        item.classList.add('is-active');

                        tabContents.forEach(content => {
                            content.classList.remove('is-active');
                            if (content.id === tabId) {
                                content.classList.add('is-active');
                            }
                        });
                    }
                    labelText = item.textContent;
                }

                // radio
                if (item.classList.contains('radio-item')) {
                    const input = item.querySelector('input[type="radio"]');
                    if (input) {
                        input.checked = true;

                        const name = input.getAttribute('name');
                        const allRadios = document.querySelectorAll(`input[name="${name}"]`);
                        allRadios.forEach(radio => {
                            radio.closest('.radio-item').classList.remove('is-active');
                        });
                        item.classList.add('is-active');

                        labelText = item.textContent.trim();
                    }
                }

                if (labelText) toggleButton.textContent = labelText;
                dropdown.classList.remove('is-open');
            });
        });
    });

    // 외부 클릭 시 드롭다운 닫기
    document.addEventListener('click', function () {
        document.querySelectorAll('.mo-drop.is-open').forEach(open => {
            open.classList.remove('is-open');
        });
    });
}

// scrollbar custom
function scrollControlFn(){
    const scrollInner = document.querySelector('.scroll');
    const progress = document.querySelector('.scroll-controller .scroll-progress');
    const thumb = document.querySelector('.scroll-controller .scroll-thumb');
    const btnLeft = document.querySelector('.scroll-controller .btn-left');
    const btnRight = document.querySelector('.scroll-controller .btn-right');
    
    
    function updateThumb(){
        const ratio = scrollInner.clientWidth / scrollInner.scrollWidth;
        const thumbWidth = ratio * progress.clientWidth;
        const maxScroll = scrollInner.scrollWidth - scrollInner.clientWidth;
        const scrollRatio = scrollInner.scrollLeft / maxScroll;
        const trackWidth = progress.clientWidth - thumbWidth;

        thumb.style.width = `${thumbWidth}px`;
        thumb.style.left = `${scrollRatio * trackWidth}px`;
    }

    updateThumb();

    scrollInner.addEventListener('scroll', updateThumb);
    window.addEventListener('resize', updateThumb);

    //버튼 클릭
    btnLeft.addEventListener('click', () => {
        scrollInner.scrollBy({ left: -200, behavior: 'smooth' });
    });
    btnRight.addEventListener('click', () => {
        scrollInner.scrollBy({ left: 200, behavior: 'smooth' });
    });


    let isDragging = false;
    let startX;

    thumb.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX - thumb.offsetLeft;
        document.body.style.userSelect = 'none';
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        document.body.style.userSelect = '';
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const trackWidth = progress.clientWidth - thumb.clientWidth;
        let newLeft = e.clientX - startX;
        newLeft = Math.max(0, Math.min(trackWidth, newLeft));
        thumb.style.left = `${newLeft} / 10 + rem`;

        const maxScroll = scrollInner.scrollWidth - scrollInner.clientWidth;
        const scrollRatio = newLeft / trackWidth;
        scrollInner.scrollLeft = scrollRatio * maxScroll;
    });

    // 트랙 클릭
    progress.addEventListener('click', (e) => {
    // thumb 클릭시엔 무시
        if (e.target === thumb) return;

        const rect = progress.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const thumbWidth = thumb.clientWidth;
        const trackWidth = progress.clientWidth - thumbWidth;

        // 클릭 위치 기준으로 스크롤 계산
        const newLeft = Math.max(0, Math.min(trackWidth, clickX - thumbWidth / 2));
        const maxScroll = scrollInner.scrollWidth - scrollInner.clientWidth;
        const scrollRatio = newLeft / trackWidth;
        const targetScroll = scrollRatio * maxScroll;

        scrollInner.scrollTo({ left: targetScroll, behavior: 'auto'});
    });
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


document.addEventListener('DOMContentLoaded', () => {
    DropdownMenus();
    bnToggle();
    initTabs('.tab-container.full');
    initTabs('.tab-container.sub');
    initTabs('.tab-container.sub.res-type');
    initTabs('.tab-container.notice-wrap');
    accoSch();
    resAddFn();
     //mobile
    if (window.innerWidth > 1024) {
        gnbOpen();
    }
    if (window.innerWidth < 1024) {
        initMoDropdown();
    }
});

window.addEventListener('resize', () => {
    DropdownMenus();
    accoSch();
});