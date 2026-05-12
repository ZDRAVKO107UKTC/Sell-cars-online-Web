import { Link } from 'react-router-dom';
import { useState } from 'react';
import { validateCommentContent } from '../utils/validation';

function CommentSection({
  comments,
  user,
  onCreate,
  onUpdate,
  onDelete,
  onLike,
}) {
  const [newComment, setNewComment] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingContent, setEditingContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleCreate = async (event) => {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      setError('');
      const validationError = validateCommentContent(newComment);
      if (validationError) {
        setError(validationError);
        return;
      }

      await onCreate({ content: newComment.trim() });
      setNewComment('');
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveEdit = async (commentId) => {
    try {
      setIsSubmitting(true);
      setError('');
      const validationError = validateCommentContent(editingContent);
      if (validationError) {
        setError(validationError);
        return;
      }

      await onUpdate(commentId, { content: editingContent.trim() });
      setEditingId(null);
      setEditingContent('');
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="panel">
      <div className="panel-heading">
        <h2>Коментари</h2>
        <span>{comments.length} мнения</span>
      </div>

      {user ? (
        <form className="comment-form" onSubmit={handleCreate}>
          <textarea
            rows="4"
            placeholder="Добави мнение, въпрос или полезен детайл за автомобила..."
            value={newComment}
            onChange={(event) => setNewComment(event.target.value)}
          />
          {error && <p className="form-error">{error}</p>}
          <button className="button" disabled={isSubmitting} type="submit">
            Добави коментар
          </button>
        </form>
      ) : (
        <div className="comment-login-panel">
          <p className="muted-text">Влез в профила си, за да зададеш въпрос или да споделиш мнение за обявата.</p>
          <Link className="text-link" to="/login">
            Към вход
          </Link>
        </div>
      )}

      <div className="comment-list">
        {comments.length === 0 && <p className="muted-text">Все още няма коментари.</p>}

        {comments.map((comment) => {
          const canManage = user && (user.role === 'admin' || user.id === comment.userId);
          const isEditing = editingId === comment.id;

          return (
            <article className="comment-card" key={comment.id}>
              <div className="comment-card__header">
                <div>
                  <strong>{comment.user?.username}</strong>
                  <span>{new Date(comment.createdAt).toLocaleString('bg-BG')}</span>
                </div>
                <div className="comment-actions">
                  <button className="button button--small button--ghost" onClick={() => onLike(comment.id)} type="button">
                    Харесай ({comment.likes})
                  </button>
                  {canManage && !isEditing && (
                    <button
                      className="button button--small button--ghost"
                      onClick={() => {
                        setEditingId(comment.id);
                        setEditingContent(comment.content);
                      }}
                      type="button"
                    >
                      Редакция
                    </button>
                  )}
                  {canManage && (
                    <button
                      className="button button--small button--danger"
                      onClick={() => onDelete(comment.id)}
                      type="button"
                    >
                      Изтрий
                    </button>
                  )}
                </div>
              </div>

              {isEditing ? (
                <div className="comment-edit">
                  <textarea
                    rows="3"
                    value={editingContent}
                    onChange={(event) => setEditingContent(event.target.value)}
                  />
                  <div className="inline-actions">
                    <button className="button button--small" onClick={() => handleSaveEdit(comment.id)} type="button">
                      Запази
                    </button>
                    <button
                      className="button button--small button--ghost"
                      onClick={() => {
                        setEditingId(null);
                        setEditingContent('');
                      }}
                      type="button"
                    >
                      Отказ
                    </button>
                  </div>
                </div>
              ) : (
                <p>{comment.content}</p>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default CommentSection;
