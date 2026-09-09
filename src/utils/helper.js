export const validataform = (data) => {
  const errors = {};
  const nameregex = /^[a-zA-Z\s]{2,20}$/;
  const placevalidator = /^[a-zA-Z\s]{2,100}$/;
  const phonevalidator = /^\d{10}$/;

  if (!data.name) {
    errors.name = "Name is required";
  } else if (!nameregex.test(data.name)) {
    errors.name = "Minimum length is 2 and max length is 20 ";
  }

  if (!data.place) {
    errors.place = "Place is required";
  } else if (!placevalidator.test(data.place)) {
    errors.place = "Minimum length is 2 and max length is 100 ";
  }

  if (!data.phone) {
    errors.phone = "Phone is required";
  } else if (!phonevalidator.test(data.phone)) {
    errors.phone = "Phone number must be exactly 10 digits.";
  }

  return errors;
};

