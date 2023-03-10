import Layout from '../common/Layout';
import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrashCan, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

function NoticeSub() {
	const getLocalData = () => {
		const data = localStorage.getItem('post');
		return JSON.parse(data);
	};

	const input = useRef(null);
	const textarea = useRef(null);
	const [Posts, setPosts] = useState(getLocalData());
	const [Allowed, setAllowed] = useState(true);

	const inputEdit = useRef(null);
	const textareaEdit = useRef(null);

	const resetForm = () => {
		input.current.value = '';
		textarea.current.value = '';
	};

	const createPost = () => {
		if (!input.current.value.trim() || !textarea.current.value.trim()) {
			return alert('제목과 본문을 모두 입력하세요');
		}
		setPosts([{ title: input.current.value, content: textarea.current.value }, ...Posts]);
		resetForm();
	};

	const deletePost = (index) => {
		if (!window.confirm('해당 게시글을 삭제하겠습니까?')) return;
		setPosts(Posts.filter((_, idx) => idx !== index));
	};

	const enableUpdate = (index) => {
		if (!Allowed) return;
		setAllowed(false);
		setPosts(
			Posts.map((post, idx) => {
				if (idx === index) post.enableUpdate = true;
				return post;
			})
		);
	};

	const disableUpdate = (index) => {
		setAllowed(true);
		setPosts(
			Posts.map((post, idx) => {
				if (idx === index) post.enableUpdate = false;
				return post;
			})
		);
	};

	const updatePost = (index) => {
		if (!inputEdit.current.value.trim() || !textareaEdit.current.value.trim()) {
			return alert('수정할 제목과 본문을 모두 입력하세요.');
		}

		setPosts(
			Posts.map((post, idx) => {
				if (idx === index) {
					post.title = inputEdit.current.value;
					post.content = textareaEdit.current.value;
					post.enableUpdate = false;
				}
				return post;
			})
		);
		setAllowed(true);
	};

	useEffect(() => {
		localStorage.setItem('post', JSON.stringify(Posts));
	}, [Posts]);

	return (
		<Layout name={'NoticeSub'}>
			<h1>NOTICE</h1>
			<p>
				We have successfully completed the project in pursuit of modern and sensuous architecture
				and space design. You can check the details of our company's activities through news of
				signing contracts with various institutions and interviews on completed projects.
			</p>
			<div className='inputBox'>
				<input type='text' placeholder='제목을 입력하세요' ref={input} />
				<br />
				<textarea col='30' row='4' placeholder='본문을 입력하세요' ref={textarea}></textarea>
				<br />
				<div className='btnSet'>
					<button onClick={resetForm}>CANCEL</button>
					<button onClick={createPost}>WRITE</button>
				</div>
			</div>

			<div className='showBox'>
				{Posts.map((post, idx) => {
					return (
						<article key={post.title}>
							{post.enableUpdate ? (
								//수정모드
								<>
									<div className='txt'>
										<h2>
											<input type='text' defaultValue={post.title} ref={inputEdit} />
											<br />
											<textarea
												cols='30'
												rows='4'
												defaultValue={post.content}
												ref={textareaEdit}
											></textarea>
											<br />
										</h2>
									</div>

									<div className='btnSet'>
										<button onClick={() => updatePost(idx)}>
											<FontAwesomeIcon icon={faCheck} />
										</button>
										<button onClick={() => disableUpdate(idx)}>
											<FontAwesomeIcon icon={faTimes} />
										</button>
									</div>
								</>
							) : (
								// 출력모드
								<>
									<div className='txt'>
										<h2>{post.title}</h2>
										<p>{post.content}</p>
									</div>

									<div className='btnSet'>
										<button
											onClick={() => {
												enableUpdate(idx);
											}}
										>
											<FontAwesomeIcon icon={faPenToSquare} />
										</button>
										<button
											onClick={() => {
												deletePost(idx);
											}}
										>
											<FontAwesomeIcon icon={faTrashCan} />
										</button>
									</div>
								</>
							)}
						</article>
					);
				})}
			</div>
		</Layout>
	);
}

export default NoticeSub;
