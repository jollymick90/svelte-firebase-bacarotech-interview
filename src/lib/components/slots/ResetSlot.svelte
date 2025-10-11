<script lang="ts">
  import { fakeSlotBooked } from "$lib/config/mock/fake-slot";
  import type { InterviewSlot, SpeakerDetails } from "$lib/type/slots";

  let resetLoading = $state(false);
  let resetError = $state("");
  let resetSuccess = $state("");
	let isLoading = $state(false);
	let feedbackMessage: { type: 'success' | 'error'; text: string } | null = $state(null);

  async function freeSlot() {
    try {
      const response = await fetch("/api/slots/reset-all", {
        method: "POST",
      });
    } catch (error) {
      
    }
  }
async function initSpeaker () {
    await assignAllSpeakers()
}

	async function assignAllSpeakers() {
		// isLoading = true;
		// feedbackMessage = null;
		let successfulAssignments = 0;
		let failedAssignments = 0;

		try {
			// --- 1. Recupera speaker e slot in parallelo ---
			const [speakersResponse, slotsResponse] = await Promise.all([
				fetch('/api/speaker'),
				fetch('/api/slots')
			]);

			if (!speakersResponse.ok || !slotsResponse.ok) {
				throw new Error('Errore nel recupero dei dati iniziali.');
			}


			const speakers: SpeakerDetails[] = await speakersResponse.json();
			const slots: InterviewSlot[] = (await slotsResponse.json());
     

 slots.sort(
          (a, b) =>
            new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
        );
         const availableSlots = slots.filter(
				(s: any) => s.status === 'AVAILABLE'
			);
      for (const s of slots) {
        const slotTimeLocale = new Date(s.startTime).toLocaleTimeString('it-IT', {
						hour: '2-digit',
						minute: '2-digit'
					});
           const slotTime = new Date(s.startTime).toISOString();
        console.log("s",  new Date(s.startTime), slotTime)
      }
			const updatePromises = [];

			// --- 2. Itera sulla lista di assegnazioni e crea le richieste di aggiornamento ---
			for (const assignment of fakeSlotBooked) {
				// Trova lo speaker corrispondente
				const speaker = speakers.find((s) => s.name === assignment.name);

				// Trova lo slot corrispondente formattando l'ora
				const slot = availableSlots.find((s) => {
          
					const slotTime = new Date(s.startTime).toLocaleTimeString('it-IT', {
						hour: '2-digit',
						minute: '2-digit'
					});
          // console.log("slotTime",slotTime, new Date(s.startTime))
					return slotTime === assignment.time;
				});
          // console.log("slotTime", slot)

				if (speaker && slot) {
					// Prepara la chiamata all'API PATCH ma non eseguirla ancora
					const promise = fetch('/api/slots/associate', {
						method: 'PATCH',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({
							slotId: slot.docId,
							speakerId: speaker.docId,
							speakerName: speaker.name
						})
					}).then((res) => {
						if (res.ok) successfulAssignments++;
						else failedAssignments++;
						return res.json();
					});
					updatePromises.push(promise);
				} else {
					console.warn(`Nessuna corrispondenza trovata per: ${assignment.name} alle ${assignment.time}`);
					failedAssignments++;
				}
			}

			// --- 3. Esegui tutte le richieste di aggiornamento in parallelo ---
			// if (updatePromises.length > 0) {
			// 	await Promise.all(updatePromises);
			// }

			feedbackMessage = {
				type: 'success',
				text: `Processo completato! Assegnazioni riuscite: ${successfulAssignments}, Fallite: ${failedAssignments}.`
			};
		} catch (err: any) {
			feedbackMessage = { type: 'error', text: err.message };
		} finally {
			isLoading = false;
		}
	}

  async function asyncReset() {
    try {
      resetLoading = true;
      const response = await fetch("/api/slots", {
        method: "DELETE",
      });
      const result = await response.json();

      if (response.ok) {
        const responseInitialize = await fetch("/api/slots/initialize", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (responseInitialize.ok) {
          resetSuccess = "Slot inizializzati correttamente";
        }
      } else {
        resetError = result.error;
      }
    } catch (e: any) {
      if (e instanceof SyntaxError) {
        resetError = "Errore: il JSON inserito non è valido.";
      } else {
        resetError = "Errore di rete: " + e.message;
      }
    } finally {
      resetLoading = false;
    }
  }
</script>

<div class="container">
  <button
    class="rounded-md bg-primary-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-primary-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
    onclick={asyncReset}
  >
    Reset Configurazioni
    {#if resetLoading}
      reset in corso...
    {/if}
  </button>

  {#if resetSuccess}
    <div class="feedback success">{resetSuccess}</div>
  {/if}
  {#if resetError}
    <div class="feedback error">{resetError}</div>
  {/if}

  <button
    class="rounded-md bg-primary-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-primary-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
    onclick={initSpeaker}
  >
    initSpeaker
    
  </button>
    <button
    class="rounded-md bg-primary-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-primary-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
    onclick={freeSlot}
  >
    Free Slot
    
  </button>
</div>

<style>
  .container {
    max-width: 400px;
    margin: 50px auto;
    padding: 20px;
    background-color: #f9fafb;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  button {
    width: 100%;
    padding: 12px;
    background-color: #4f46e5;
    color: white;
    font-weight: 600;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  button:hover:not(:disabled) {
    background-color: #4338ca;
  }
  button:disabled {
    background-color: #a5b4fc;
    cursor: not-allowed;
  }
  .feedback {
    margin-top: 20px;
    padding: 12px;
    border-radius: 4px;
    text-align: center;
    font-weight: 500;
  }
  .success {
    background-color: #d1fae5;
    color: #065f46;
  }
  .error {
    background-color: #fee2e2;
    color: #991b1b;
  }
</style>
