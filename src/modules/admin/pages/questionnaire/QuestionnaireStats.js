import React, { useEffect, useState } from 'react';
import { getQuestionnaireStats } from '../../services/question.services';

const QuestionnaireStats = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        getQuestionnaireStats()
            .then((response) => {
                if (response?.success) {
                    setStats(response.data);
                } else {
                    setError('Failed to load statistics');
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error('Error:', err);
                setError('Something went wrong. Please try again.');
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="text-center my-5">
                <div className="spinner-border text-primary" role="status" />
                <div className="mt-2">Loading questionnaire stats...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-danger my-5 text-center" role="alert">
                {error}
            </div>
        );
    }

    return (
        <div className="container my-5">
            <h2 className="text-center mb-4">📊 Astrology Questionnaire Stats</h2>
            {Object.entries(stats).map(([id, question]) => (
                <div key={id} className="card mb-4 shadow-sm">
                    <div className="card-body">
                        <h5 className="card-title">{question.question_title}</h5>
                        <h6 className="card-subtitle mb-3 text-muted">
                            Answered by <strong>{question.totalAnswered}</strong> user(s)
                        </h6>

                        {Object.entries(question.options).map(([slug, option]) => (
                            <div key={slug} className="mb-3">
                                <div className="d-flex justify-content-between">
                                    <strong>{option.option_value}</strong>
                                    <span>{option.percentage}%</span>
                                </div>
                                <div className="progress">
                                    <div
                                        className={`progress-bar ${getBarColor(option.percentage)}`}
                                        role="progressbar"
                                        style={{ width: `${option.percentage}%` }}
                                        aria-valuenow={option.percentage}
                                        aria-valuemin="0"
                                        aria-valuemax="100"
                                    >
                                        {option.percentage}%
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

const getBarColor = (percentage) => {
    const p = parseFloat(percentage);
    if (p >= 75) return 'bg-success';
    if (p >= 50) return 'bg-info';
    if (p >= 25) return 'bg-warning';
    return 'bg-danger';
};

export default QuestionnaireStats;
