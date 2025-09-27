"use strict";

/*============================================ 
======== Table of JS Functions =========


============================================*/

document.addEventListener("DOMContentLoaded", function () {
  /*
===============================================================
=> Reusable Functions Start
===============================================================
  */
  // modal toggle function
  function modalToggle(modalName, modalBox, open, close) {
    modalName.addEventListener("click", () => {
      if (modalBox.classList.contains(open)) {
        modalBox.classList.remove(open);
        modalBox.classList.add(close);
        document.removeEventListener("click", closeDropdownOutside);
      } else {
        modalBox.classList.add(open);
        modalBox.classList.remove(close);
        document.addEventListener("click", closeDropdownOutside);
      }

      function closeDropdownOutside(event) {
        const isClickedInsideDropdown = modalBox.contains(event.target);
        const isClickedOnDropdownBtn = modalName.contains(event.target);

        if (!isClickedInsideDropdown && !isClickedOnDropdownBtn) {
          modalBox.classList.add(close);
          modalBox.classList.remove(open);
          document.removeEventListener("click", closeDropdownOutside);
        }
      }
    });
  }

  //select active item
  function selectOneItem(items) {
    if (items) {
      const item = items.querySelectorAll(".item");

      item.forEach((e) =>
        e.addEventListener("click", () => {
          if (!e.classList.contains("active")) {
            items.querySelector(".active").classList.remove("active");

            e.classList.add("active");
          }
        })
      );
    }
  }

  //select item from modal
  function selectItemFromModal(items, modalBox, slectText) {
    items.forEach((e) =>
      e.addEventListener("click", () => {
        modalBox.classList.remove("modalClose");
        modalBox.classList.add("modalOpen");
        slectText.innerHTML = e.textContent;
      })
    );
  }

  // Modal with different open and close button
  function modalDiffOpenClose(
    modalClass,
    modalOpenButtonClass,
    modalCloseButtonClass,
    closeModalClass,
    openModalClass
  ) {
    const modal = document.querySelector(`.${modalClass}`);
    const modalOpenButton = document.querySelector(`.${modalOpenButtonClass}`);
    const modalCloseButton = document.querySelector(
      `.${modalCloseButtonClass}`
    );
    modal &&
      modalOpenButton.addEventListener("click", () => {
        modal.classList.remove(closeModalClass);
        modal.classList.add(openModalClass);
      });

    modal &&
      modalCloseButton.addEventListener("click", () => {
        modal.classList.remove(openModalClass);
        modal.classList.add(closeModalClass);
      });
  }

  // Select One From Maney Item
  function selectItemFromMany(
    parentClass,
    itemClass,
    activeItemStyle,
    inactiveItemStye
  ) {
    const selectParentClass = document.querySelector(`.${parentClass}`);
    const items = selectParentClass?.querySelectorAll(`.${itemClass}`);

    selectParentClass &&
      items.forEach((e) => {
        e.addEventListener("click", () => {
          const activeItem = selectParentClass.querySelector(
            `.${activeItemStyle}`
          );

          const inactiveItem = e.querySelector(`.${inactiveItemStye}`);

          if (inactiveItem) {
            activeItem.classList.remove(activeItemStyle);
            activeItem.classList.add(inactiveItemStye);

            inactiveItem.classList.remove(inactiveItemStye);
            inactiveItem.classList.add(activeItemStyle);
          }
        });
      });
  }

  // Select One Item From Many
  function selectOneItem(items) {
    if (items) {
      const item = items.querySelectorAll(".item");

      item.forEach((e) =>
        e.addEventListener("click", () => {
          if (!e.classList.contains("active")) {
            items.querySelector(".active").classList.remove("active");

            e.classList.add("active");
          }
        })
      );
    }
  }

  function showPasswordFunc(item, passField) {
    item.addEventListener("click", () => {
      if (item.classList.contains("ph-eye-closed")) {
        item.classList.add("ph-eye");
        item.classList.remove("ph-eye-closed");
        passField.setAttribute("type", "text");
      } else {
        item.classList.remove("ph-eye");
        item.classList.add("ph-eye-closed");
        passField.setAttribute("type", "password");
      }
    });
  }

  //create Tab
  function createTab(
    tabArea,
    activeTabButtonClass,
    activeTabClass,
    hiddenTabClass,
    tabButtonClass,
    tabContentClass
  ) {
    const tabButtons = document.querySelectorAll(`.${tabButtonClass}`);
    const tabContent = document.querySelectorAll(`.${tabContentClass}`);

    tabButtons.forEach((e) => {
      e.addEventListener("click", () => {
        if (!e.classList.contains(activeTabClass)) {
          const activeTabButton = tabArea.querySelector(
            `.${activeTabButtonClass}`
          );
          const tabData = tabArea.querySelector(`#${e.id}_data`);

          activeTabButton.classList.remove(activeTabButtonClass);
          e.classList.add(activeTabButtonClass);

          tabArea
            .querySelector(`.${activeTabClass}`)
            .classList.remove(activeTabClass);
          //Add hiddentab class on every tab data element if the classlist doen't contain hiddentab class
          tabContent.forEach((e) => {
            if (!e.classList.contains(hiddenTabClass)) {
              e.classList.add(hiddenTabClass);
            }
          });

          tabData.classList.remove(hiddenTabClass);
          tabData.classList.add(activeTabClass);
        }
      });
    });
  }

  //active class toggle
  function activeClassToggle(itemClass) {
    const item = document.querySelector(itemClass);

    if (item) {
      item.addEventListener("click", () => {
        if (item.classList.contains("active")) {
          item.classList.remove("active");
        } else {
          item.classList.add("active");
        }
      });
    }
  }

  /*
===============================================================
=> Reusable Functions End
===============================================================
*/

  //splash screen modal
  const splashModal = document.querySelector(".splashModal");

  splashModal &&
    setTimeout(() => {
      splashModal.classList.add("hidden");
      splashModal.classList.remove("fixed");
    }, 500);

  //face id toggle
  activeClassToggle(".sign-in-toggle");
  //connect cleaversave
  activeClassToggle(".connect-kleversave");
  //hide account
  activeClassToggle(".hide-account");

  //show password
  const passowordShow = document.querySelector(".passwordShow");
  const passwordField = document.querySelector(".passwordField");
  if (passowordShow) {
    showPasswordFunc(passowordShow, passwordField);
  }
  const confirmPasswordShow = document.querySelector(".confirmPasswordShow");
  const confirmPasswordField = document.querySelector(".confirmPasswordField");
  if (confirmPasswordShow) {
    showPasswordFunc(confirmPasswordShow, confirmPasswordField);
  }

  //show hide seedlist
  const showSeedListButton = document.querySelector(".showSeedListButton");
  const showSeedList = document.querySelector(".showSeedList");
  const seedlist = document.querySelector(".seedList");

  showSeedListButton &&
    showSeedListButton.addEventListener("click", () => {
      showSeedList.classList.add("hidden");
      seedlist.classList.remove("hidden");
      seedlist.classList.add("flex");
    });

  //agree modal toggle
  const agreementModal = document.querySelector(".agreementModal");
  const openAgreeModal = document.querySelector(".openAgreeModal");

  openAgreeModal &&
    openAgreeModal.addEventListener("click", () => {
      if (agreementModal.classList.contains("invisible")) {
        agreementModal.classList.remove("invisible");
      } else {
        agreementModal.classList.remove("invisible");
      }
    });

  const homeTab = document.querySelector(".homeTab");
  homeTab &&
    createTab(
      homeTab,
      "activeTabButton",
      "activeTab",
      "hiddenTab",
      "tabButton",
      "tab-content"
    );

  //buysell tab
  const buySellTab = document.querySelector(".buySellTab");
  buySellTab &&
    createTab(
      buySellTab,
      "activeTabButton",
      "activeTab",
      "hiddenTab",
      "tabButton",
      "tab-content"
    );

  //accout option modal
  modalDiffOpenClose(
    "accountOptionModal",
    "accountOptionModalOpenButton",
    "accountOptionModalCloseButton",
    "hidden",
    "fixed"
  );

  //biometrics modal
  modalDiffOpenClose(
    "checkBiometrics",
    "checkBiometricsOpenButton",
    "checkBiometricsCloseButton",
    "hidden",
    "fixed"
  );

  //logout modal
  modalDiffOpenClose(
    "logoutModal",
    "logoutModalOpenButton",
    "logoutModalCloseButton",
    "hidden",
    "fixed"
  );

  //token modal
  modalDiffOpenClose(
    "tokenModal",
    "tokenModalOpenButton",
    "tokenModalCloseButton",
    "hidden",
    "fixed"
  );
  //send modal
  modalDiffOpenClose(
    "sendModal",
    "sendModalOpenButton",
    "sendModalCloseButton",
    "hidden",
    "fixed"
  );
  //swap modal
  modalDiffOpenClose(
    "swapModal",
    "swapModalOpenButton",
    "swapModalCloseButton",
    "hidden",
    "fixed"
  );
  //paywith modal
  modalDiffOpenClose(
    "payWithModal",
    "payWithModalOpenButton",
    "payWithModalCloseButton",
    "hidden",
    "fixed"
  );
  //chooseNetworkModal
  modalDiffOpenClose(
    "chooseNetworkModal",
    "chooseNetworkModalOpenButton",
    "chooseNetworkModalCloseButton",
    "hidden",
    "fixed"
  );
  //select Language
  const suggestedLanguage = document.querySelector(".suggestedLanguage");
  suggestedLanguage && selectOneItem(suggestedLanguage);
  const otherLanguage = document.querySelector(".otherLanguage");
  otherLanguage && selectOneItem(otherLanguage);

  //auto lock item select
  const lockTimeItems = document.querySelector(".lockTimeItems");
  lockTimeItems && selectOneItem(lockTimeItems);

  //browser category
  const browserCategory = document.querySelector(".browserCategory");
  selectOneItem(browserCategory);
});
