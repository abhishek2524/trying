$(document).ready(() => {
  $("#datepicker-start, #datepicker-end").datepicker();

  $(".rangeselector").draggable({
    containment: "parent",
    axis: "x",
    start(e, ui) {
      const range = $(this).closest(".full-range");
      console.log("range");
      const rangeWidth = range.width();
      const position = ui.position.left;
      const insert = Math.ceil((position / rangeWidth) * 10000);
      $(this).append(`<span id="ui-helper"></span>`);
      $("#ui-helper").html(insert > 9900 ? 10000 : insert);
    },
    drag(e, ui) {
      const range = $(this).closest(".full-range");
      const rangeWidth = range.width();
      const position = ui.position.left;
      const insert = Math.ceil((position / rangeWidth) * 10000);
      $("#ui-helper").html(insert > 9900 ? 10000 : insert);
      $("input[name='monthly-budget']").val(insert > 9900 ? 10000 : insert);
      $(".rangeselector").css("left", insert / 100 + "%");
      $(".rangeinner").css("width", insert / 100 + "%");
    },
    stop(e) {
      $(this).find("#ui-helper").remove();
    },
  });

  const numberOfBedrooms = $("#grid-45");
  const propertyType = $('select[data-name="Property type"]');

  propertyType.on("change", function () {
    if (this.value === "100") {
      numberOfBedrooms.show();
      $(".rangeselector").css("left", "99.53%");
      $(".rangeinner").css("width", "99.53%");
      $("input[name='monthly-budget']").val(10000);
    } else if (this.value === "200") {
      $(".rangeselector").css("left", "40%");
      $(".rangeinner").css("width", "40%");
      $("input[name='monthly-budget']").val(4000);
      numberOfBedrooms.hide();
    } else if (this.value === "300") {
      $(".rangeselector").css("left", "25%");
      $(".rangeinner").css("width", "25%");
      $("input[name='monthly-budget']").val(2500);
      numberOfBedrooms.hide();
    } else {
      numberOfBedrooms.hide();
    }
  });

  $("#selector-14")
    .on("focus", function () {
      this.multiple = 1;
    })
    .on("blur", function () {
      this.multiple = 0;
    });

  $("#selector-32").on("change", function () {
    if (!this.value) return false;

    const options = $("#selector-33 option");
    options.show();

    if (this.value === "0") return false;

    options.each((i, item) => {
      if (item.dataset.value !== this.value) $(item).hide();
    });
  });

  function formExecute(form) {
    const fields = form.elements;
    const data = {};
    for (let i in fields) {
      let field = fields[i];
      if (
        ["TEXTAREA", "INPUT", "SELECT"].indexOf(field.tagName) !== -1 &&
        field.type !== "submit"
      ) {
        if (field.type === "checkbox") data[field.name] = field.checked;
        else if (field.type === "radio" && !field.checked) continue;
        else data[field.name] = field.value;
      }
    }
    return data;
  }

  function getElemetsAttributes(elements, attributes = []) {
    if (typeof attributes !== "object") attributes = [attributes];

    const data = {};

    if (!(elements instanceof jQuery)) elements = $(elements);

    elements.each((i, element) => {
      attributes.forEach((attribute) => {
        if (data[attribute]) data[attribute].push(element[attribute]);
        else data[attribute] = [element[attribute]];
      });
    });

    return data;
  }

  $('select[data-name="Aim of visit"]').on("change", function () {
    const study = $("#viewing_panel .grid-line.study");
    const internship = $("#viewing_panel .grid-line.internship");
    if (this.value === "Study") study.css({ display: "table" });
    else study.hide();

    if (this.value === "Internship") internship.css({ display: "table" });
    else internship.hide();
  });

  function fetchfunc(action, callback, json) {
    fetch(action, {
      method: "post",
      body: JSON.stringify((data = json)),
    })
      .then((response) => response.json())
      .then((result) => callback(result));
  }

  $("#my-form").on("submit", function (e) {
    e.preventDefault();

    const preferredAreaChecked = $('input[name="input_radio-20-333"]:checked');
    const preferredArea =
      preferredAreaChecked.length > 1
        ? getElemetsAttributes(preferredAreaChecked, "value")["value"].join(
            "; "
          )
        : "";

    const data = {
      method: "add",
      propertyType: $('select[data-name="Property type"]')
        .find("option:selected")
        .html()
        .replace(/\r\n/gi, ""),
      numberOfBedrooms: $('input[name="input_radio-20"]:checked').val(),
      monthlyBudget: $('input[name="monthly-budget"]').val(),
      startOfTheRent: $("input#datepicker-start").val(),
      endOfTheRent: $("input#datepicker-end").val(),
      preferredArea: preferredArea,
      whereAreYouFrom: $('input[name="input_radio-18"]:checked').val(),
      aimOfVisit: $('select[data-name="Aim of visit"]').val(),
      nameOfUniversity: $('select[data-name="Name of university"]')
        .find("option:selected")
        .html()
        .replace(/\r\n/gi, ""),
      nameOfProgram: $('select[data-name="Name of program"]')
        .find("option:selected")
        .html()
        .replace(/\r\n/gi, ""),
      programOffTheList: $("input#input_text-39").val(),
      nameOfComplany: $("input#input_text-123").val(),
      elseToKnow: $("input#input_text-26").val(),
      email: $("input#input_text-31").val(),
    };
    const callback = (response) => {
      console.log(response);
      if (response.result == "No") {
        $("#li-email-warning").show();
        alert(
          "Email already registered, please use unique email and try again."
        );
      } else {
        if (response.result) $("#li-email-warning").hide();
        alert("Thanky you! Form is submitted");
      }
    };
    fetchfunc(this.action, callback, data);
  });

  $("#auth").on("submit", function (e) {
    e.preventDefault();
    const data = {
      method: "auth",
      username: this.elements.username.value,
      password: this.elements.password.value,
    };
    const callback = (response) => {
      console.log(response);
      if (response.result) window.location.reload();
    };
    fetchfunc(this.action, callback, data);
  });
});
