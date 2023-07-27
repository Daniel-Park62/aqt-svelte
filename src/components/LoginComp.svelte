<script>
	import { getCheckPass, isLogged } from "../aqtstore";
	
	const imgUrl = new URL('/images/Logo.png', import.meta.url).href
	let password = "";
	let error = "";

	async function login() {
		// const chk = await getCheckPass(password);
		const res = await fetch("/logonchk?pass=" + password) ;
    let data = await res.json();

		if (data.chk) {
			$isLogged = 2;
			if (error) error = "";
		} else {
			error = "비밀번호가 맞지않습니다.";
		}
	}

	async function login2() {
		$isLogged = 1;
	}
</script>

<div class="login-wrapper">
	<img src={imgUrl} alt="" />
	<h2>비밀번호</h2>
	<form on:submit|preventDefault={login} id="login-form">
		<input
			type="password"
			class="form-control"
			id="passw"
			bind:value={password}
		/>
		<div class="btns">
			<button type="submit" class="btn1">관리자로그인</button>
			<button on:click={login2} class="btn2">일반사용자</button>
		</div>
		<div id="error_message" class="text-danger">
			<small>{error}</small>
		</div>
	</form>
</div>

<style>
	.login-wrapper {
		/* position: relative; */
		margin: 0 auto;
		border: none;
		width: 400px;
		height: auto;
		/* background-image: url("/images/login.png"); */
		/* background-repeat: no-repeat; */
		/* background-size: 70% ; */
		/* background-position: left; */
		padding: 40px;
		box-sizing: border-box;
		opacity: 0.8;
		background-color: rgb(26, 26, 176);
	}
	.login-wrapper > h2{
    font-size: 24px;
    color: #e2eee7;
    margin-bottom: 20px;
}
.text-danger {
	font-size: 20px;
    color: yellow;
    margin-top: 20px;
}

	#passw {
    width: 100%;
    height: 48px;
    padding: 0 10px;
    box-sizing: border-box;
    margin-bottom: 16px;
    border-radius: 6px;
    background-color: #F8F8F8;
	}
	/* form {
		width: 100%;
		height: 48px;
		padding: 0 10px;
		box-sizing: border-box;
		margin-bottom: 16px;
		border-radius: 6px;
		background-color: #f8f8f8;
	} */

	.btns {
		margin-top: 30px;
		width: fit-content;
		display: flex;
	}

	.btns>button {
		color: #fff;
    font-size: 16px;
    background-color: #6A24FE;
		border-radius: 6px;

	}
	/* .btns::after {
    content: "";
    display: block;
    clear: both;
}
	button {
		display: block; 
	} */
</style>
