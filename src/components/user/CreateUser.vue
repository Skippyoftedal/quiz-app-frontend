<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useUserStore } from "@/stores/UserStore";
import type { CreateUserRequestDTO } from "@/models/user/CreateUserRequestDTO";
import { useRoute } from "vue-router";
import router from "@/router";
import { ErrorHandlingService } from "@/services/ErrorHandlingService";

const username = ref("");
const password = ref("");
const confirmPassword = ref("");
const email = ref("");
const name = ref("");
const surname = ref("");
const store = useUserStore();
const errorMessage = ref("");
const route = useRoute();

/**
 * Watch for changes in username, password, confirmPassword, email, name and surname fields and clear error message.
 */
watch([username, password, confirmPassword, email, name, surname], () => {
  errorMessage.value = "";
});

/**
 * Handles user registration
 */
async function register() {
  if (password.value !== confirmPassword.value) {
    errorMessage.value = "Password conformation not correct.";
    return;
  }

  const user: CreateUserRequestDTO = {
    username: username.value.trim(),
    password: password.value.trim(),
    email: email.value.trim(),
    name: name.value.trim(),
    surname: surname.value.trim(),
  };

  try {
    await store.registerUser(user);

    if (route.query.redirect) {
      await router.push(route.query.redirect as string);
    } else {
      await router.push("/");
    }
  } catch (err) {
    errorMessage.value = await ErrorHandlingService.handleRequestError(
      err,
      "Registration failed",
    );
  }
}

/**
 * Check if a string is blank.
 *
 * @param str The string to check.
 * @returns True if the string is blank, false otherwise.
 */
function isBlank(str: string) {
  return !str || /^\s*$/.test(str);
}

// Computed property to determine if all required fields are filled.
const fieldsFilled = computed(() => {
  return (
    !isBlank(username.value) &&
    !isBlank(email.value) &&
    !isBlank(name.value) &&
    !isBlank(surname.value) &&
    !isBlank(confirmPassword.value)
  );
});

/**
 * Prevent entering space in input fields.
 *
 * @param event The keydown event object.
 */
function preventSpace(event: any) {
  if (event.key === " " || event.code === "Space") {
    event.preventDefault();
  }
}
</script>

<template>
  <div class="flex">
    <div class="grid">
      <form @submit.prevent="register">
        <div class="item-1">
          <h1>Register!</h1>
        </div>

        <div class="item-2">
          <label for="username">Username:</label>
          <input
            type="text"
            id="username"
            v-model="username"
            placeholder="Enter your username"
            required
            @keydown="preventSpace"
            data-cy="username"
          />
        </div>

        <div class="item-2">
          <label for="email">Email:</label>
          <input
            type="text"
            id="email"
            v-model="email"
            placeholder="Email"
            required
            @keydown="preventSpace"
            data-cy="email"
          />
        </div>

        <div class="item-3">
          <label for="first-name">First name:</label>
          <input
            type="text"
            id="first-name"
            v-model="name"
            placeholder="First name"
            required
            @keydown="preventSpace"
            data-cy="first-name"
          />
        </div>

        <div class="item-4">
          <label for="surname">Sur name:</label>
          <input
            type="text"
            id="surname"
            v-model="surname"
            placeholder="Surname"
            required
            @keydown="preventSpace"
            data-cy="surname"
          />
        </div>

        <div class="item-3">
          <label for="password">Password:</label>
          <input
            class="input-field"
            type="password"
            id="password"
            v-model="password"
            placeholder="Enter your password"
            required
            @keydown="preventSpace"
            data-cy="password"
          />
        </div>

        <div class="item-4">
          <label for="confirm-password">Confirm Password:</label>
          <input
            class="input-field"
            type="password"
            id="confirm-password"
            v-model="confirmPassword"
            placeholder="Confirm password"
            required
            @keydown="preventSpace"
            data-cy="confirm-password"
          />
        </div>

        <div class="item-2 button">
          <input
            id="register-button"
            type="submit"
            value="Register"
            :disabled="!fieldsFilled"
            data-cy="register-button"
          /><br />
        </div>

        <div
          v-if="errorMessage"
          id="error"
          class="error-message item-5"
          data-cy="error-message"
        >
          {{ errorMessage }}
        </div>

        <div class="item-5">
          <div class="login-route-container">
            <p>Already have an account?</p>
            <router-link to="/login" data-cy="login-link">Login</router-link>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.flex {
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
  font-family: "Inter", sans-serif;
}

.grid {
  display: flex;
  border-radius: 35px;
  max-width: 800px;
  height: 600px;
  background: rgba(255, 255, 255, 0.93);
  box-shadow: 0 4px 4px -2px #000000;
  padding: 2em;
}

input[type="text"],
input[type="password"] {
  border: 2px solid rgba(0, 0, 0, 0.17);
  font-weight: bold;
  padding: 10px 10px;
  border-radius: 15px;
}

input[type="submit"] {
  display: inline;
  font-weight: bold;
  width: 100%;
  background-color: #242062;
  color: white;
  padding: 14px 20px;
  border: none;
  border-radius: 15px;
  cursor: pointer;
  font-size: 16px;
}

input[type="submit"]:hover {
  background-color: #0f0e33;
}

input[type="submit"]:disabled {
  background-color: #8b8a98;
}

label {
  font-size: 14px;
  font-weight: bold;
}

.error-message {
  color: red;
  text-align: center;
  font-size: 90%;
}

.login-route-container p {
  margin-top: 0;
}

form {
  display: grid;
  gap: 20px;
}

.item-1 {
  text-align: center;
  grid-column: 1/5;
}

.item-2,
.item-5 {
  display: inherit;
  grid-column: 2/4;
}

.item-3 {
  display: inherit;
  grid-column: 2/3;
}

.item-4 {
  display: inherit;

  grid-column: 3/4;
}

.item-5 {
  text-align: center;
}

/*
 Query for mobile screens.
*/
@media (max-width: 700px) {
  form {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  form {
    align-items: flex-end;
  }

  .item-1 {
    align-self: center;
  }

  .item-2.button {
    align-self: center;
    width: 100%;
  }

  .item-5 {
    align-self: center;
  }

  label {
    padding-right: 15px;
    align-self: center;
  }

  .error-message {
    align-self: center;
  }
}
</style>
