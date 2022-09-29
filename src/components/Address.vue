<template>
	<div class="input-group mb-3">
		<label class="form-label">주소</label>
		<div class="address-controls">
			<div class="input-group get-postcode mb-1 w-100">
				<input
					type="text"
					class="form-control postcode-control"
					placeholder="우편번호"
					id="postcode"
					:value="znCode" />
				<button
					class="btn btn-secondary findAddress-btn"
					type="button"
					id="postcode"
					@click="openApi()">
					주소찾기
				</button>
			</div>
			<input
				type="text"
				class="form-control mb-1 w-100"
				id="roadAddress"
				placeholder="도로명주소"
				:value="rdAddress" />
			<input
				type="text"
				class="form-control mb-1 w-100"
				id="jibunAddress"
				placeholder="지번주소"
				:value="jbAddress" />
			<input
				type="text"
				class="form-control mb-1 w-100"
				id="detailAddress"
				placeholder="상세주소"
				:value="detailAddress"
				@input="$emit('inputFromChild', $event)" />
			<input
				type="text"
				class="form-control mb-1 w-100"
				id="extraAddress"
				placeholder="참고항목"
				:value="extraRdAddress" />
		</div>
	</div>
</template>

<script>
export default {
	props: {
		znCode: String,
		rdAddress: String,
		jbAddress: String,
		detailAddress: String,
		extraRdAddress: String,
	},
	methods: {
		openApi() {
			this.$emit('openApi');
		},
	},
};
</script>

<style scoped>
.input-group {
	flex-wrap: nowrap;
	margin: 0 auto;
	flex: 0 0 auto;
	width: 100%;
}
.form-select,
.form-control {
	display: flex;
	flex: 0 0 auto;
	width: 60%;
	font-size: 0.9rem;
	padding-top: 8px;
	border-top-left-radius: 5px !important;
	border-bottom-left-radius: 5px !important;
}
.postcode-control {
	display: flex;
	flex: 0 0 auto;
	width: 80%;
}
.form-label {
	display: flex;
	width: 20%;
	margin: auto 30px auto 0px;
	align-items: center;
	justify-content: right;
	word-break: keep-all;
	font-weight: 500;
}
.address-controls {
	display: flex;
	flex-direction: column;
	margin: 0 auto;
	flex: 0 0 auto;
	width: 60%;
}
.btn {
	display: flex;
	justify-content: center;
	margin: 30px auto;
	font-size: 0.9rem;
	border: none;
	width: 15%;
}
.findAddress-btn {
	border: none;
	font-size: 0.85rem;
	margin: 0 auto;
	display: flex;
	flex: 0 0 auto;
	justify-content: center;
	align-items: center;
	width: 20%;
	background-color: #e9ecef;
	border: 1px solid #ced4da;
	color: #212529;
}
.findAddress-btn:hover {
	background-color: #dee2e6;
}
@media (max-width: 768px) {
	.input-group {
		display: flex;
		flex-direction: column;
		flex-wrap: nowrap;
		margin: 0 auto;
		flex: 0 0 auto;
		width: 100%;
	}
	.form-label {
		display: flex;
		width: 100%;
		margin: 10px auto 10px auto;
		align-items: center;
		justify-content: left;
		word-break: keep-all;
		font-weight: 500;
	}
	.form-select,
	.form-control {
		display: flex;
		flex: 0 0 auto;
		width: 100%;
		font-size: 0.9rem;
		border-top-left-radius: 5px !important;
		border-bottom-left-radius: 5px !important;
		align-items: center;
		justify-content: center;
	}
	.address-controls {
		display: flex;
		flex-direction: column;
		margin: 0 auto;
		flex: 0 0 auto;
		width: 100%;
	}
	.btn {
		display: flex;
		justify-content: center;
		margin: 30px auto;
		font-size: 0.9rem;
		border: none;
		width: 15%;
	}
	.findAddress-btn {
		border: none;
		font-size: 0.85rem;
		margin: 0 auto;
		display: flex;
		flex: 0 0 auto;
		justify-content: center;
		align-items: center;
		width: 30%;
		background-color: #e9ecef;
		border: 1px solid #ced4da;
		color: #212529;
	}
	.findAddress-btn:hover {
		background-color: #dee2e6;
	}
	.postcode-control {
		display: flex;
		flex: 0 0 auto;
		width: 70%;
	}
	.get-postcode {
		display: flex;
		flex-direction: row;
		flex: 0 0 auto;
	}
}
</style>
