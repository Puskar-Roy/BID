import { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { OffersList } from "./offers/OffersList";
import { Comment, Offer } from "./offers/types";

const OffersPage = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [newComment, setNewComment] = useState<Record<string, string>>({});
  const [expandedOffers, setExpandedOffers] = useState<Record<string, boolean>>({});

  const { state } = useAuthContext();

  // Fetch offers from the backend
  useEffect(() => {
    setLoading(true);
    const fetchOffers = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API}/api/offers/my-offers`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${state.user?.token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch offers");
        }
        const data: Offer[] = await response.json();
        setOffers(data);
        
        // Initialize comments, expanded state, and new comment fields
        const initialComments: Record<string, Comment[]> = {};
        const initialExpanded: Record<string, boolean> = {};
        const initialNewComment: Record<string, string> = {};

        data.forEach((offer) => {
          initialComments[offer._id] = [];
          initialExpanded[offer._id] = false;
          initialNewComment[offer._id] = "";
        });

        setComments(initialComments);
        setExpandedOffers(initialExpanded);
        setNewComment(initialNewComment);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    if (state.user?.token) {
      fetchOffers();
    } else {
      setLoading(false);
    }
  }, [state.user]);

  // Handle offer response (accept/reject)
  const handleOfferResponse = async (
    offerId: string,
    status: "accepted" | "rejected"
  ) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API}/api/offers/respond`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${state.user?.token}`,
          },
          body: JSON.stringify({ offerId, status }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update offer status");
      }

      // Update the offers list with the updated status
      setOffers((prevOffers) =>
        prevOffers.map((offer) =>
          offer._id === offerId ? { ...offer, status } : offer
        )
      );
    } catch (err) {
      setError((err as Error).message);
    }
  };

  // Toggle comment section visibility
  const toggleComments = (offerId: string) => {
    setExpandedOffers((prev) => ({
      ...prev,
      [offerId]: !prev[offerId],
    }));
  };

  // Handle new comment input change
  const handleCommentChange = (offerId: string, value: string) => {
    setNewComment((prev) => ({
      ...prev,
      [offerId]: value,
    }));
  };

  // Add a new comment
  const addComment = async (offerId: string) => {
    if (!newComment[offerId].trim() || !state.user?.token) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API}/api/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${state.user?.token}`,
          },
          body: JSON.stringify({
            offerId,
            message: newComment[offerId],
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add comment");
      }

      const newCommentData = await response.json();

      // Add comment to the list
      setComments((prev) => ({
        ...prev,
        [offerId]: [...(prev[offerId] || []), newCommentData],
      }));

      // Clear the input
      setNewComment((prev) => ({
        ...prev,
        [offerId]: "",
      }));
    } catch (err) {
      setError((err as Error).message);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center p-8">
        <div className="text-xl">Loading offers...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full flex justify-center items-center p-8">
        <div className="text-xl text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="w-[95%] mx-auto mb-[20rem]">
      <div className="absolute circlePosition w-screen sm:w-[590px] h-[400px] bg-gradient-to-r from-indigo-400 rounded-[100%] top-[70%] left-[50%]  blur-[90px] translate-x-[-50%] translate-y-[-50%] z-[-1]" />
      <div className="header my-4 h-12 px-10 flex items-center justify-center">
        <h1 className="font-bold text-3xl">
          My <span className="text-indigo-600">Offers</span>
        </h1>
      </div>

      {offers.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-lg text-gray-600">No offers found</p>
        </div>
      ) : (
        <OffersList
          offers={offers}
          comments={comments}
          expandedOffers={expandedOffers}
          newComment={newComment}
          onToggleComments={toggleComments}
          onOfferResponse={handleOfferResponse}
          onCommentChange={handleCommentChange}
          onAddComment={addComment}
          formatDate={formatDate}
        />
      )}
    </div>
  );
};

export default OffersPage;
